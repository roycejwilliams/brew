import "dotenv/config";
import pool from "./db/db.js";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { randomInt } from "crypto";
import { sendSMS, sendEmail } from "./otpActions.js";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit"; //restricts how many request an IP or user can make in a window time
import cors from "cors";
import cookieParser from "cookie-parser";
import cron from "node-cron";

const app = express();
const port = "8080";

//Used to control the rate of traffic sent or received by a network interface or service
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // how long to remember a request for
  limit: 10, //how many request to allow
  standardHeaders: "draft-8", // Enables RateLimit Header
  legacyHeaders: false, // Enable the X-Rate-Limit header
  ipv6Subnet: 56, //improves routing efficiency, enhances network security through segementation, and maintain organized, hiearchical address planning
  message: "Rate limit hit, please try again in approx. 15 minutes",
  statusCode: 429,
});

app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://br3w.app",
            "https://https://brew-git-feature-frontend-setup-br3w.vercel.app/",
          ]
        : "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

//Will parse the cookie header upon request and exposes the
//cookies data property req.cookie
//cookies - small text files containing unique data sent by a website to the web browser
app.use(cookieParser());

// function to geneate a 6 digit verifcation code between 100000 to 999999
function generateOTP() {
  return randomInt(100000, 1000000);
}

declare global {
  namespace Express {
    interface Request {
      user?: UserProp; // Use a specific User type if you have one
    }
  }
}

//verify authenticatedToken
//used to intercept incoming request to ensure they contain
//a valid token before granting access to protected routes.
//what actually enforces security
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  //retrieve the value of a cookie named "token"
  const token = req.cookies.token;

  //if not the token the redirect back to home
  if (!token) return res.redirect("/");

  //verifies the token
  //along with your made JWT_SECRET_KEY
  jwt.verify(
    token,
    process.env.JWT_SECRET_KEY!,
    (err: Error | null, user: any) => {
      //token expired
      if (err) return res.status(403).send("Invalid or expired token");

      //its telling it to resemble the shape of the UserProp
      req.user = user as UserProp;
      //goes to the next function
      next();
    },
  );
};

//Only valid users with a token can see this
// app.get("/pulse", (req, res) => res.send("Welcome to Pulse!"));
// app.get("/moment", (req, res) => res.send("Welcome to Moments!"));
// app.get("/profile", (req, res) => res.send("Your Profile"));
// app.get("/manage", (req, res) => res.send("Admin Management"));

// Defining user role
//used to allow certain access to certain url path or permission
//insert role
const userRole = (role: string) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      //retrieve current user role
      const userRole = req.user?.role;
      //if the role placed doesnt eequal the actual
      //role return a error
      if (role !== userRole) {
        return res
          .status(403)
          .send({ message: "Forbidden. Does not have correct role." });
      }

      return next();
    } catch (error) {
      next(error);
    }
  };
};

// APPLICATION FLOW
// Create an application
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed =
        origin === "https://br3w.app" ||
        /^https:\/\/brew-.*\.vercel\.app$/.test(origin);
      allowed
        ? callback(null, true)
        : callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Get all applications (admin only)
app.get(
  "/applications",
  authenticateToken,
  userRole("admin"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const applications = await pool.query("SELECT * FROM applications");
      const allApplications = applications.rows;
      return res.status(200).send({ success: true, data: allApplications });
    } catch (error) {
      next(error);
    }
  },
);

//create application
app.post(
  "/applications",
  async (req: Request<ApplicationProp>, res: Response, next: NextFunction) => {
    if (!req.body) {
      return res.status(400).send("Request body cannot be empty.");
    }

    const { first_name, last_name, email } = req.body;

    if (!first_name || !last_name || !email) {
      const missing = ["first_name", "last_name", "email"].find(
        (field) => !req.body[field],
      );

      return res.status(400).send(`${missing} is required.`);
    }

    try {
      const insertApp = await pool.query(
        "INSERT INTO applications (first_name, last_name, email) VALUES ($1, $2, $3) RETURNING *",
        [first_name, last_name, email],
      );

      const createApp = insertApp.rows[0];

      await sendEmail({
        appsubmit: true,
        email: "roycewilliamsj@gmail.com",
        applicant: createApp,
      });

      return res.status(201).send({
        success: true,
        data: createApp,
      });
    } catch (error) {
      next(error);
    }
  },
);

//OTP status merger
const otpMerge = (status: string) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    if (!req.body) return res.status(400).send("Request body cannot be empty");

    if (status !== "accepted" && status !== "rejected") {
      return res
        .status(400)
        .send(
          "The server cannot process the request because the client sent invalid syntax or data ",
        );
    }

    try {
      const otp = generateOTP();
      if (!otp) return res.status(401).send("Unauthorized OTP.");

      const expiryAt = Date.now() + 300000;
      const expiryTimeStamp = new Date(expiryAt).toISOString();

      if (status === "accepted") {
        const accepted = await pool.query(
          `INSERT INTO users (application_id, first_name, last_name, email, phone_number, username, otp_code, otp_expiry) 
        SELECT id, first_name, last_name, email, phone_number, split_part(email, '@', 1), $2, $3 
        FROM applications 
        WHERE id = $1 
        RETURNING *;`,
          [req.params.id, otp, expiryTimeStamp],
        );

        const acceptedUser: UserProp = accepted.rows[0];

        await sendSMS({
          otp_code: otp.toString(),
          phone_number: acceptedUser.phone_number,
          status,
        });
        await sendEmail({
          otp_code: otp.toString(),
          email: acceptedUser.email,
          status,
        });

        return res.status(201).send({
          success: true,
          data: acceptedUser,
        });
      }

      if (status === "rejected") {
        const rejected = await pool.query(
          `UPDATE users SET status = 'pending' WHERE id = $1 RETURNING *`,
          [req.params.id],
        );

        const rejectedUser: UserProp = rejected.rows[0];

        await sendSMS({ phone_number: rejectedUser.phone_number, status });
        await sendEmail({ email: rejectedUser.email, status });

        return res
          .status(200)
          .send({ success: true, message: "Application rejected" });
      }
    } catch (error) {
      next(error);
    }
  };
};

// Update application status by id (admin only)
app.put(
  "/applications/:id",
  authenticateToken,
  userRole("admin"),
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      return res.status(400).send("Request body cannot be empty");
    }

    const { status } = req.body;

    if (status !== "accepted" && status !== "rejected")
      return res
        .status(400)
        .send(
          "The server cannot process the request because the client sent invalid syntax or data ",
        );

    try {
      const revealStatus = await pool.query(
        "UPDATE applications SET status = $2 WHERE id = $1 RETURNING *",
        [req.params.id, status],
      );

      const updateStatus: ApplicationProp = revealStatus.rows[0];

      if (updateStatus) {
        otpMerge(updateStatus.status as string);
        return;
      }

      return res.status(404).send({
        response: `User ${req.params.id} doesn't exist`,
      });
    } catch (error) {
      next(error);
    }
  },
);

// USER FLOW
// Get user by id
app.get(
  "/users/:id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user?.id !== req.params.id) {
        return res
          .status(403)
          .send("Unauthorized: You can only access your own account");
      }
      const getUser = await pool.query("SELECT * FROM users WHERE id = $1", [
        req.params.id,
      ]);

      const user: UserProp = await getUser.rows[0];

      if (user) {
        return res.status(200).send({
          success: true,
          data: {
            username: user.username,
            id: user.id,
            created_at: user.created_at,
            first_name: user.first_name,
            last_name: user.last_name,
            description: user.description,
            email: user.email,
            phone_number: user.phone_number,
            location: user.location,
            instagram: user.instagram,
            twitter: user.twitter,
            linkedin: user.linkedin,
            role: user.role,
          },
        });
      }

      return res.status(404).send({
        failed: true,
        message: `User Doesn't Exist: ${req.params.id}`,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Verify user OTP to log in
//happens during login
app.post(
  "/auth/verify/:id",
  limiter,
  async (req: Request, res: Response, next: NextFunction) => {
    const { otp_code } = req.body;

    try {
      const isUserLocked = await pool.query(
        `SELECT locked FROM users WHERE id = $1`,
        [req.params.id],
      );

      const lockedUser: UserProp = isUserLocked.rows[0];

      if (lockedUser.locked) {
        return res.status(429).send("User Locked!");
      }

      const authUser = await pool.query(
        `SELECT email, otp_code, otp_expiry, username, id, created_at, role FROM users WHERE id = $1 AND otp_code = $2 AND otp_expiry > NOW()`,
        [req.params.id, otp_code],
      );

      //get the authorized user information
      const UserAuthorize: UserProp = authUser.rows[0];

      //if he exist
      if (UserAuthorize) {
        //create a jwt signature for the cookie in this shape.
        const authorize = jwt.sign(
          {
            username: UserAuthorize.username,
            id: UserAuthorize.id,
            created_at: UserAuthorize.created_at,
            role: UserAuthorize.role,
          },
          `${process.env.JWT_SECRET_KEY}`,
          {
            expiresIn: "1y",
          },
        );

        //set the authenication back to null
        await pool.query(
          `UPDATE users SET otp_code = null, otp_expiry = null, otp_attempts = 0 WHERE id = $1 RETURNING *`,
          [req.params.id],
        );

        //creates the cookie token with the following rules
        res.cookie("token", authorize, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 365 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).send({
          success: true,
        });
      }

      const attempts = await pool.query(
        `UPDATE users
         SET otp_attempts = otp_attempts + 1,
           locked = CASE
           WHEN otp_attempts + 1 >= 5 THEN true ELSE false END
         WHERE id = $1
         RETURNING otp_attempts, locked`,
        [req.params.id],
      );

      const lockAttempts: UserProp = attempts.rows[0];

      if (lockAttempts.otp_attempts === 5) {
        return res.status(423).send({
          success: true,
          message: "Exceeded the number of Sign in request",
          data: {
            locked: lockAttempts.locked,
            attempts: lockAttempts.otp_attempts,
          },
        });
      }

      return res.status(400).send(`Authentication failed`);
    } catch (error) {
      next(error);
    }
  },
);

//verify email to log in
app.post(
  "/auth/lookup",
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedGeneratedOTP = generateOTP();
    const updatedExpiryAt = Date.now() + 300000;
    const updatedExpiryTimeStamp = new Date(updatedExpiryAt).toISOString();

    const { email } = req.body;
    try {
      const verifyEmail = await pool.query(
        `SELECT users.id FROM users INNER JOIN applications ON users.application_id = applications.id WHERE applications.email = $1`,
        [email],
      );

      const userEmail: UserProp = verifyEmail.rows[0];

      if (userEmail) {
        const updateOTP = await pool.query(
          "UPDATE users SET otp_code = $2, otp_expiry = $3 WHERE id = $1 RETURNING *",
          [userEmail.id, updatedGeneratedOTP, updatedExpiryTimeStamp],
        );

        const updatedOTP: UserProp = updateOTP.rows[0];
        await sendSMS({
          phone_number: updatedOTP.phone_number,
          otp_code: updatedOTP.otp_code,
          login: true,
        });
        await sendEmail({
          email: updatedOTP.email,
          otp_code: updatedOTP.otp_code,
          login: true,
        });
        return res.status(200).send({
          success: true,
          data: { id: updatedOTP.id },
        });
      }

      res.status(404).send("User not found.");
    } catch (error) {
      next(error);
    }
  },
);

// Resend OTP if expired or not received
app.put(
  "/auth/resend/:id",
  limiter,
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedGeneratedOTP = generateOTP();
    const updatedExpiryAt = Date.now() + 300000;
    const updatedExpiryTimeStamp = new Date(updatedExpiryAt).toISOString();

    try {
      const isUserLocked = await pool.query(
        `SELECT locked FROM users WHERE id = $1`,
        [req.params.id],
      );

      const lockedUser: UserProp = isUserLocked.rows[0];

      if (lockedUser.locked === true) {
        return res.status(429).send("User Locked!");
      }

      const updateOTP = await pool.query(
        "UPDATE users SET otp_code = $2, otp_expiry = $3 WHERE id = $1 RETURNING *",
        [req.params.id, updatedGeneratedOTP, updatedExpiryTimeStamp],
      );

      const updatedOTP: UserProp = updateOTP.rows[0];

      if (updatedOTP) {
        await sendSMS({
          phone_number: updatedOTP.phone_number,
          otp_code: updatedOTP.otp_code,
          resent: true,
        });
        await sendEmail({
          email: updatedOTP.email,
          otp_code: updatedOTP.otp_code,
          resent: true,
        });
        return res.status(200).send({
          success: true,
          message: "OTP resent successfully",
        });
      }

      return res
        .status(404)
        .send(`User with id: ${req.params.id} doesn't exist.`);
    } catch (error) {
      next(error);
    }
  },
);

// Update user information by id
app.put(
  "/users/:id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.status(400).send("Request body cannot be empty");

    const allowed = [
      "first_name",
      "last_name",
      "phone_number",
      "email",
      "description",
      "username",
      "location",
      "instagram",
      "twitter",
      "linkedin",
    ];

    const filterKeys = Object.keys(req.body).filter((key) => {
      return allowed.includes(key);
    });

    const values = filterKeys.map((key) => req.body[key]);

    const userKeys = filterKeys
      .map((key, index) => {
        return `${key} = $${index + 2}`;
      })
      .join(", ");

    try {
      if (req.user?.id !== req.params.id) {
        return res
          .status(403)
          .send("Unauthorized: You can only update your own account");
      }

      const updateUserInformation = await pool.query(
        `UPDATE users SET ${userKeys} WHERE id = $1 RETURNING *`,
        [req.params.id, ...values],
      );

      const updatedUser: UserProp = updateUserInformation.rows[0];

      if (updatedUser) {
        return res.status(200).send({
          success: true,
          data: updatedUser,
        });
      }

      return res
        .status(404)
        .send(`User with id: ${req.params.id} doesn't exist.`);
    } catch (error) {
      next(error);
    }
  },
);

// Delete user by id
app.delete(
  "/users/:id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user?.id !== req.params.id) {
        return res
          .status(403)
          .send("Unauthorized: You can only delete your own account");
      }

      const userDeletion = await pool.query(
        `DELETE FROM users WHERE id = $1 RETURNING *`,
        [req.params.id],
      );

      const deleteUser: UserProp = userDeletion.rows[0];

      if (deleteUser) {
        return res.status(200).send({
          success: true,
          message: `User Deleted: ${req.params.id}`,
        });
      }

      return res.status(404).send({
        failed: true,
        message: `User Doesn't Exist: ${req.params.id}`,
      });
    } catch (error) {
      next(error);
    }
  },
);

// CIRCLE FLOW
// Create a circle by user id
app.post(
  "/circles/:id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.status(400).send("Request body cannot be empty.");

    const { circle_name } = req.body;

    if (!circle_name) {
      return res.status(400).send(`"circle_name" is required.`);
    }

    try {
      if (req.user?.id !== req.params.id) {
        return res
          .status(400)
          .send("Unauthorized: You can only access your own account");
      }
      const insertCircle = await pool.query(
        "INSERT INTO circles (owner_id, circle_name) VALUES ($1, $2) RETURNING *",
        [req.params.id, circle_name],
      );

      const createCircle: CircleProp = await insertCircle.rows[0];

      if (createCircle) {
        return res.status(201).send({
          success: true,
          data: createCircle,
        });
      }

      return res.status(400).send("Unable to Create Circle");
    } catch (error) {
      next(error);
    }
  },
);

// Get all circles owned by user
app.get(
  "/circles/:id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user?.id !== req.params.id) {
        return res
          .status(400)
          .send("Unauthorized: You can only access your own account");
      }

      const getCircleById = await pool.query(
        `SELECT * FROM circles WHERE owner_id = $1`,
        [req.params.id],
      );

      const retrieveCircle: CircleProp[] = getCircleById.rows;

      if (retrieveCircle) {
        return res.status(200).send({
          success: true,
          data: retrieveCircle,
        });
      }

      return res.status(400).send("Unable to retrieve circles");
    } catch (error) {
      next(error);
    }
  },
);

// Get all circles user is a member of
app.get(
  "/circles/:id/member",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user?.id !== req.params.id) {
        return res
          .status(400)
          .send("Unauthorized: You can only access your own account");
      }

      const retrieveCirclebyMember = await pool.query(
        `SELECT * FROM circles INNER JOIN 
        circle_members ON circles.id = circle_members.circle_id 
        WHERE circle_members.member_id = $1`,
        [req.params.id],
      );

      const getCircle: CircleProp[] = retrieveCirclebyMember.rows;

      if (getCircle) {
        return res.status(200).send({
          success: true,
          data: getCircle,
        });
      }

      return res.status(400).send("Unable to Retrive request");
    } catch (error) {
      next(error);
    }
  },
);

//specific circle members
app.get(
  "/circles/:user_id/with-members",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const getCirclesWithMembers = await pool.query(
        `SELECT 
  c.id,
  c.circle_name,
  c.circle_image,
  COALESCE(
    json_agg(
      json_build_object(
        'id', u.id,
        'first_name', u.first_name,
        'last_name', u.last_name,
        'username', u.username,
        'profile_image', u.profile_image
      )
    ) FILTER (WHERE u.id IS NOT NULL),
    '[]'
  ) AS members
FROM circles c
LEFT JOIN circle_members cm ON c.id = cm.circle_id
LEFT JOIN users u ON cm.member_id = u.id
WHERE c.owner_id = $1
GROUP BY c.id`,
        [req.params.user_id],
      );

      return res.status(200).send({
        success: true,
        data: getCirclesWithMembers.rows,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Update a circle by owner
app.put(
  "/circles/:id/:circle_id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.status(400).send("Request body cannot be empty");

    const allowed = ["circle_name", "circle_image"];

    const filterKeys = Object.keys(req.body).filter((key) => {
      // just filters the key for you
      return allowed.includes(key);
    });

    const values = filterKeys.map((value) => req.body[value]); //takes in the values of the filtered key

    const circleKeys = filterKeys
      .map((circle, index) => {
        return `${circle} = $${index + 3}`;
      })
      .join(", ");

    try {
      if (req.user?.id !== req.params.id) {
        return res
          .status(403)
          .send("Unauthorized: You can only delete your own circle");
      }
      const updateCircle = await pool.query(
        `UPDATE circles SET ${circleKeys} WHERE owner_id = $1 AND id = $2 RETURNING *`,
        [req.params.id, req.params.circle_id, ...values],
      );

      const circleUpdated: CircleProp = updateCircle.rows[0];

      if (circleUpdated) {
        return res.status(200).send({
          success: true,
          data: {
            circle_name: circleUpdated.circle_name,
            circle_image: circleUpdated.circle_image,
          },
        });
      }

      return res.status(404).send("Desired Circle doesn't exist");
    } catch (error) {
      next(error);
    }
  },
);

// Delete a circle by owner
app.delete(
  "/circles/:id/:circle_id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user?.id !== req.params.id) {
        return res
          .status(403)
          .send("Unauthorized: You can only delete your own circle");
      }

      const deleteCircleByUser = await pool.query(
        `DELETE FROM circles WHERE owner_id = $1 AND id = $2 RETURNING *`,
        [req.params.id, req.params.circle_id],
      );

      const deleteCircle: CircleProp = deleteCircleByUser.rows[0];

      if (deleteCircle) {
        return res.status(200).send({
          success: true,
          message: `Circle named ${deleteCircle.circle_name} successfully deleted`,
        });
      }

      return res.status(400).send("Unable to handle request");
    } catch (error) {
      next(error);
    }
  },
);

// Remove a member from a circle (owner or self)
app.delete(
  "/circles/:circle_id/members/:member_id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //Selects Owner of Circle
      const selectOwnerOfCircle = await pool.query(
        `SELECT owner_id FROM circles WHERE id = $1`,
        [req.params.circle_id],
      );

      const ownerOfCircle: CircleProp = selectOwnerOfCircle.rows[0];

      if (
        req.user?.id !== ownerOfCircle.owner_id &&
        req.user?.id !== req.params.member_id
      ) {
        return res.status(403).send("Unauthorized");
      }

      const removeMemberFromCircle = await pool.query(
        `DELETE FROM circle_members WHERE circle_id = $1 AND member_id = $2 RETURNING *`,
        [req.params.circle_id, req.params.member_id],
      );

      const removeMember = removeMemberFromCircle.rows[0];

      if (removeMember) {
        return res.status(200).send({
          success: true,
          message: `Removed ${removeMember.member_id}`,
        });
      }

      return res.status(400).send("Unable to delete user");
    } catch (error) {
      next(error);
    }
  },
);

// MOMENT FLOW
// Create a moment by user id
app.post(
  "/moments/:id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.status(400).send("Request body cannot be empty.");

    const {
      moments_name,
      location,
      location_name,
      moment_start,
      visibility_type,
      description,
      circle_id,
      image,
      principles,
      expectations,
      faqs,
      vibes,
    } = req.body;

    if (
      !moments_name ||
      !location ||
      !location_name ||
      !moment_start ||
      !visibility_type ||
      !description
    ) {
      const missing = [
        "moments_name",
        "location",
        "location_name",
        "moment_start",
        "visibility_type",
        "description",
      ].find((key) => !req.body[key]);

      return res.status(400).send(`${missing} is required.`);
    }

    try {
      if (req.user?.id !== req.params.id) {
        return res
          .status(400)
          .send("Unauthorized: You can only access your own account");
      }

      const createMomentsById = await pool.query(
        `INSERT INTO moments 
    (creator_id, moments_name, location, location_name, moment_start, visibility_type, description, circle_id, image, principles, expectations, faqs, vibes) 
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
   RETURNING *`,
        [
          req.params.id,
          moments_name,
          location,
          location_name,
          moment_start,
          visibility_type,
          description,
          circle_id,
          image,
          principles,
          expectations,
          JSON.stringify(faqs),
          vibes,
        ],
      );

      const createMoment: MomentProp = createMomentsById.rows[0];

      if (createMoment) {
        return res.status(201).send({
          success: true,
          data: createMoment,
        });
      }

      return res.status(400).send("Unable to Create Moment");
    } catch (error) {
      next(error);
    }
  },
);

//get specific moment
app.get(
  "/moments/moment/:moment_id",
  authenticateToken,
  async (req, res, next) => {
    try {
      const getMoment = await pool.query(
        `SELECT * FROM moments WHERE id = $1`,
        [req.params.moment_id],
      );

      const moment: MomentProp = getMoment.rows[0];
      if (!moment) return res.status(404).send("Moment not found.");

      const userId = req.user?.id;
      const isCreator = moment.creator_id === userId;

      if (isCreator)
        return res.status(200).send({ success: true, data: moment });

      if (moment.visibility_type === "nearby") {
        return res.status(200).send({ success: true, data: moment });
      }

      if (moment.visibility_type === "circle") {
        const memberCheck = await pool.query(
          `SELECT 1 FROM circle_members WHERE circle_id = $1 AND member_id = $2`,
          [moment.circle_id, userId],
        );
        if (!memberCheck.rows.length)
          return res.status(403).send("Unauthorized.");
        return res.status(200).send({ success: true, data: moment });
      }

      if (moment.visibility_type === "people") {
        const inviteCheck = await pool.query(
          `SELECT 1 FROM invite_attendees WHERE moment_id = $1 AND attendee_id = $2`,
          [moment.id, userId],
        );
        if (!inviteCheck.rows.length)
          return res.status(403).send("Unauthorized.");
        return res.status(200).send({ success: true, data: moment });
      }

      return res.status(403).send("Unauthorized.");
    } catch (error) {
      next(error);
    }
  },
);

//get a nearby moment
app.get(
  "/moments/nearby",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lng, lat, radius = 10000, filter = "tonight" } = req.query;

      const lngNum = parseFloat(lng as string);
      const latNum = parseFloat(lat as string);
      const radNum = parseFloat(radius as string);

      if (isNaN(lngNum) || isNaN(latNum)) {
        return res.status(400).send("Valid coordinates are required.");
      }

      let startTime: string;
      let endTime: string;
      const pad = (n: number) => String(n).padStart(2, "0");
      const fmt = (d: Date) =>
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}-07:00`;

      const now = new Date();

      if (filter === "tonight") {
        startTime = fmt(now);
        const end = new Date(now);
        end.setDate(end.getDate() + 1);
        end.setHours(4, 0, 0, 0);
        endTime = fmt(end);
      } else if (filter === "tomorrow") {
        const start = new Date(now);
        start.setDate(start.getDate() + 1);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setHours(23, 59, 59, 0);
        startTime = fmt(start);
        endTime = fmt(end);
      } else {
        startTime = fmt(now);
        const end = new Date(now);
        end.setDate(end.getDate() + 7);
        end.setHours(23, 59, 59, 0);
        endTime = fmt(end);
      }

      const result = await pool.query(
        `SELECT m.*,
          ST_Distance(
            ST_SetSRID(ST_MakePoint(m.location[0], m.location[1]), 4326)::geography,
            ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
          ) as distance
        FROM moments m
        WHERE 
          m.location IS NOT NULL
          AND m.visibility_type = 'nearby'
          AND ST_DWithin(
            ST_SetSRID(ST_MakePoint(m.location[0], m.location[1]), 4326)::geography,
            ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
            $3
          )
          AND m.moment_start >= $4
          AND m.moment_start <= $5
          AND m.close_moment IS NOT TRUE
        ORDER BY distance ASC
        LIMIT 20`,
        [lngNum, latNum, radNum, startTime, endTime],
      );

      return res.status(200).send({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  },
);

// Get all moments created by user
app.get(
  "/moments/:id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user?.id !== req.params.id) {
        return res
          .status(400)
          .send("Unauthorized: You can only access your own account");
      }

      const getMomentbyId = await pool.query(
        `SELECT * FROM moments WHERE creator_id = $1`,
        [req.params.id],
      );

      const getMoments: MomentProp[] = getMomentbyId.rows;

      if (getMoments) {
        return res.status(200).send({
          success: true,
          data: getMoments,
        });
      }

      return res.status(400).send("Unable to retrieve moments");
    } catch (error) {
      next(error);
    }
  },
);

// Get all moments user is a member of
app.get(
  "/moments/:id/member",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user?.id !== req.params.id) {
        return res
          .status(400)
          .send("Unauthorized: You can only access your own account");
      }

      const retrieveMomentsforMember = await pool.query(
        `SELECT * FROM moments 
        INNER JOIN moment_attendees 
        ON moments.id = moment_attendees.moment_id WHERE moment_attendees.attendee_id = $1`,
        [req.params.id],
      );

      const getMoment: MomentProp[] = retrieveMomentsforMember.rows;

      if (getMoment) {
        return res.status(200).send({
          success: true,
          data: getMoment,
        });
      }

      return res.status(400).send("Unable to Retrive request");
    } catch (error) {
      next(error);
    }
  },
);

//fetch all users associated with the moment
app.get(
  "/moments/:moment_id/attendees/details",
  authenticateToken,
  async (req, res, next) => {
    try {
      const { moment_id } = req.params;
      const result = await pool.query(
        `SELECT 
  u.id,
  u.username,
  u.first_name,
  u.last_name,
  u.profile_image,
  COALESCE(ma.checked_in, false) as checked_in,
  ma.checked_in_at,
  CASE 
    WHEN ma.attendee_id IS NOT NULL THEN 'attending'
    ELSE ia.status
  END as status
FROM (
  SELECT attendee_id FROM moment_attendees WHERE moment_id = $1
  UNION
  SELECT attendee_id FROM invite_attendees WHERE moment_id = $1
) combined
JOIN users u ON u.id = combined.attendee_id
LEFT JOIN moment_attendees ma ON ma.attendee_id = u.id AND ma.moment_id = $1
LEFT JOIN invite_attendees ia ON ia.attendee_id = u.id AND ia.moment_id = $1`,
        [moment_id],
      );
      return res.status(200).send({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  },
);

//specific moment attendees
app.get(
  "/moments/:moment_id/attendees",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const getAttendees = await pool.query(
        `SELECT u.id, u.first_name, u.last_name, u.username, u.profile_image
        FROM moment_attendees ma
        JOIN users u ON ma.attendee_id = u.id
        WHERE ma.moment_id = $1`,
        [req.params.moment_id],
      );

      const attendees = getAttendees.rows;

      return res.status(200).send({
        success: true,
        data: attendees,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Update moment details by user id
app.put(
  "/moments/:id/:moment_id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.status(400).send("Request body cannot be empty");

    //formats the location before making any updates
    // transforms {} into ()
    const formatLocation = (loc: any): string | null => {
      if (!loc) return null;
      if (typeof loc === "string") return loc; // already formatted
      if (typeof loc === "object" && loc.x !== undefined) {
        return `(${loc.x},${loc.y})`;
      }
      return null;
    };

    const allowed = [
      "image",
      "moments_name",
      "moment_start",
      "moment_end",
      "description",
      "location",
      "location_name",
      "cap_attendance",
      "close_moment",
      "visibility_type",
    ];

    //returns the desired keys
    const filteredKeys = Object.keys(req.body).filter((key) => {
      return allowed.includes(key);
    });

    //returns the desired values based on filtered keys.. goes in the dependency
    const valueOfKeys = filteredKeys.map((key) => {
      if (key === "location") return formatLocation(req.body[key]);
      return req.body[key];
    });
    //numerical order of how each desired change with be in
    const momentKeys = filteredKeys
      .map((key, index) => {
        return `${key} = $${index + 3}`;
      })
      .join(", ");

    try {
      if (req.user?.id !== req.params.id) {
        return res
          .status(400)
          .send("Unauthorized: You can only access your own account");
      }

      const updateMoment = await pool.query(
        `UPDATE moments SET ${momentKeys} WHERE creator_id = $1 and id = $2 RETURNING *`,
        [req.params.id, req.params.moment_id, ...valueOfKeys],
      );

      const momentUpdated: MomentProp = updateMoment.rows[0];

      if (momentUpdated) {
        return res.status(200).send({
          success: true,
          data: momentUpdated,
        });
      }

      return res.status(400).send("Unable to update moment");
    } catch (error) {
      next(error);
    }
  },
);

// Delete a moment by owner
app.delete(
  "/moments/:id/:moment_id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user?.id !== req.params.id) {
        return res
          .status(403)
          .send("Unauthorized: You can only delete your own circle");
      }
      const deleteMomentbyOwner = await pool.query(
        `DELETE FROM moments WHERE creator_id = $1 AND id = $2 RETURNING *`,
        [req.params.id, req.params.moment_id],
      );

      const deletedMoment: MomentProp = await deleteMomentbyOwner.rows[0];

      if (deletedMoment) {
        return res.status(200).send({
          success: true,
          message: `Moment ${deletedMoment.moments_name} was deleted`,
        });
      }

      return res.status(404).send("Moment doesn't exist");
    } catch (error) {
      next(error);
    }
  },
);

// Remove an attendee from a moment (owner or self)
app.delete(
  "/moments/:moment_id/attendees/:attendee_id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const selectOwnerOfMoment = await pool.query(
        "SELECT creator_id FROM moments WHERE id = $1",
        [req.params.moment_id],
      );

      const ownerOfMoment: MomentProp = selectOwnerOfMoment.rows[0];

      if (
        req.user?.id !== ownerOfMoment.creator_id &&
        req.user?.id !== req.params.attendee_id
      ) {
        return res.status(403).send("Unauthorized");
      }

      const removeAttendeeFromMoment = await pool.query(
        `DELETE FROM moment_attendees WHERE moment_id = $1 AND attendee_id = $2 RETURNING *`,
        [req.params.moment_id, req.params.attendee_id],
      );

      const removeAttendee = removeAttendeeFromMoment.rows[0];

      if (removeAttendee) {
        return res.status(200).send({
          success: true,
          message: `Removed ${removeAttendee.attendee_id}`,
        });
      }

      return res.status(404).send("Attendee doesn't exist");
    } catch (error) {
      next(error);
    }
  },
);

// Get all photos for a moment
app.get(
  "/moments/:moment_id/photos",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await pool.query(
        `SELECT mp.*, u.username, u.profile_image
        FROM moment_photos mp
        JOIN users u ON mp.uploader_id = u.id
        WHERE mp.moment_id = $1
        ORDER BY mp.created_at ASC`,
        [req.params.moment_id],
      );

      // After inserting photo, notify the moment creator
      const getMomentCreator = await pool.query(
        `SELECT m.creator_id, m.moments_name, u.email, u.phone_number 
  FROM moments m 
  JOIN users u ON m.creator_id = u.id 
  WHERE m.id = $1`,
        [req.params.moment_id],
      );
      const creator = getMomentCreator.rows[0];

      const getUploader = await pool.query(
        `SELECT username FROM users WHERE id = $1`,
        [req.user?.id],
      );
      const uploader = getUploader.rows[0];

      // Don't notify if uploader is the creator
      if (creator.creator_id !== req.user?.id) {
        await sendEmail({
          email: creator.email,
          photo_uploaded: {
            moments_name: creator.moments_name,
            uploader_username: uploader.username,
          },
        });
        await sendSMS({
          phone_number: creator.phone_number,
          photo_uploaded: {
            moments_name: creator.moments_name,
            uploader_username: uploader.username,
          },
        });
      }
      return res.status(200).send({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  },
);

// Upload a photo
app.post(
  "/moments/:moment_id/photos",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const { image_url } = req.body;
    if (!image_url) return res.status(400).send("image_url is required.");
    try {
      const result = await pool.query(
        `INSERT INTO moment_photos (moment_id, uploader_id, image_url)
        VALUES ($1, $2, $3) RETURNING *`,
        [req.params.moment_id, req.user?.id, image_url],
      );
      return res.status(201).send({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  },
);

// Delete a photo — only uploader can delete
app.delete(
  "/moments/:moment_id/photos/:photo_id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const check = await pool.query(
        `SELECT uploader_id FROM moment_photos WHERE id = $1`,
        [req.params.photo_id],
      );
      if (!check.rows.length) return res.status(404).send("Photo not found.");
      if (check.rows[0].uploader_id !== req.user?.id)
        return res.status(403).send("Unauthorized.");

      await pool.query(`DELETE FROM moment_photos WHERE id = $1`, [
        req.params.photo_id,
      ]);
      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  },
);

//INVITE CIRCLE FLOW
// Owner invites a member to a circle
app.post(
  "/circles/:id/invite/:member_id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invitedBy = await pool.query(
        "SELECT owner_id FROM circles WHERE id = $1",
        [req.params.id],
      );

      const owner: CircleProp = invitedBy.rows[0];

      if (req.user?.id !== owner.owner_id) {
        return res
          .status(403)
          .send("Unauthorized: You can only access your own account");
      }

      const inviteMemberToCircle = await pool.query(
        "INSERT INTO invite_members (circle_id, member_id, invited_by) VALUES ($1, $2, $3) RETURNING *",
        [req.params.id, req.params.member_id, owner.owner_id],
      );

      const invitedMember: InviteMembersProp = inviteMemberToCircle.rows[0];

      if (invitedMember) {
        const getInvitedUser = await pool.query(
          `SELECT email, phone_number FROM users WHERE id = $1`,
          [req.params.member_id],
        );

        const invitedUser: UserProp = getInvitedUser.rows[0];

        await sendEmail({
          email: invitedUser.email,
          invite_type: "received",
          invite_target: "circle",
        });
        await sendSMS({
          phone_number: invitedUser.phone_number,
          invite_type: "received",
          invite_target: "circle",
        });
        return res.status(201).send({
          success: true,
          data: invitedMember,
        });
      }

      return res.status(404).send("User not found");
    } catch (error) {
      next(error);
    }
  },
);

// User views their circle invites
app.get(
  "/invites/members/:member_id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user?.id !== req.params.member_id) {
        return res
          .status(403)
          .send("Unauthorized: You can only access your own account");
      }

      const getAllInvitesByUser = await pool.query(
        "SELECT * FROM invite_members WHERE member_id = $1",
        [req.params.member_id],
      );

      const invitesForUser: InviteMembersProp[] = getAllInvitesByUser.rows;

      if (invitesForUser) {
        return res.status(200).send({
          success: true,
          data: invitesForUser,
        });
      }

      return res.status(404).send("Cannot find user");
    } catch (error) {
      next(error);
    }
  },
);

// Owner views sent circle invites
app.get(
  "/invites/members/sent/:invited_by",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user?.id !== req.params.invited_by) {
        return res
          .status(403)
          .send("Unauthorized: You can only access your own account");
      }

      const getAllInvitesByOwner = await pool.query(
        "SELECT * FROM invite_members WHERE invited_by = $1",
        [req.params.invited_by],
      );

      const invitesFromOwner: InviteMembersProp[] = getAllInvitesByOwner.rows;

      if (invitesFromOwner) {
        return res.status(200).send({
          success: true,
          data: invitesFromOwner,
        });
      }

      return res.status(404).send("Cannot find user");
    } catch (error) {
      next(error);
    }
  },
);

//User Accept or Reject Circle Invite
app.put(
  "/invites/members/:id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.status(400).send("Request body cannot be empty.");

    const { status } = req.body;

    try {
      const getMemberId = await pool.query(
        "SELECT member_id, circle_id FROM invite_members WHERE id = $1",
        [req.params.id],
      );

      const memberId: InviteMembersProp = getMemberId.rows[0];

      if (req.user?.id !== memberId.member_id) {
        return res
          .status(403)
          .send("Unauthorized: You can only access your own account");
      }

      const now = status === "accepted" ? new Date().toISOString() : null;

      const statusDecision = await pool.query(
        `UPDATE invite_members SET status = $2, accepted_at = $3 WHERE id = $1 RETURNING *`,
        [req.params.id, status, now],
      );

      const decision: InviteMembersProp = statusDecision.rows[0];

      const getOwner = await pool.query(
        `SELECT email, phone_number FROM users WHERE id = $1`,
        [decision.invited_by],
      );

      const owner: UserProp = getOwner.rows[0];

      if (decision.status === "accepted") {
        if (owner) {
          await sendEmail({
            email: owner.email,
            invite_type: "accepted",
            invite_target: "circle",
          });
          await sendSMS({
            phone_number: owner.phone_number,
            invite_type: "accepted",
            invite_target: "circle",
          });
        }
        const addToCircleQuery = await pool.query(
          `INSERT INTO circle_members (member_id, circle_id) VALUES ($1, $2) RETURNING *`,
          [memberId.member_id, memberId.circle_id],
        );

        const path: InviteMembersProp = addToCircleQuery.rows[0];

        if (path) {
          return res.status(201).send({
            success: true,
            data: path,
            message: `${path.member_id} added to ${path.circle_id}`,
          });
        }
      }

      if (decision.status === "rejected") {
        if (owner) {
          await sendEmail({
            email: owner.email,
            invite_type: "rejected",
            invite_target: "circle",
          });
          await sendSMS({
            phone_number: owner.phone_number,
            invite_type: "rejected",
            invite_target: "circle",
          });
        }
        return res.status(200).send({
          failed: true,
          message: `${decision.member_id} rejected by ${decision.circle_id}`,
        });
      }

      return res.status(400).send("Unable to handle request");
    } catch (error) {
      next(error);
    }
  },
);

//INVITE MOMENT FLOW
// Owner/User invites a member to a moment
app.post(
  "/moment/:id/invite",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const { recipient } = req.body;

    try {
      // Check if requester is owner or attendee + check close_moment
      const ownerCheck = await pool.query(
        `SELECT creator_id, close_moment FROM moments WHERE id = $1`,
        [req.params.id],
      );

      const ownerOfMoment: MomentProp = ownerCheck.rows[0];
      const isOwner = req.user?.id === ownerOfMoment.creator_id;

      if (ownerOfMoment.close_moment) {
        return res.status(403).send("This moment is closed.");
      }

      const attendeeCheck = await pool.query(
        `SELECT attendee_id FROM moment_attendees WHERE moment_id = $1 AND attendee_id = $2`,
        [req.params.id, req.user?.id],
      );

      const isAttendee = attendeeCheck.rows[0];

      if (!isOwner && !isAttendee) {
        return res.status(403).send("Unauthorized");
      }

      // Find recipient
      const findRecipient = await pool.query(
        `SELECT id, email, phone_number FROM users WHERE username = $1 OR email = $1 OR phone_number = $1`,
        [recipient],
      );

      const recipientUser: UserProp = findRecipient.rows[0];

      if (!recipientUser) return res.status(404).send("Recipient not found.");

      // Create invite
      const inviteAttendeeToMoment = await pool.query(
        "INSERT INTO invite_attendees (moment_id, attendee_id, invited_by) VALUES ($1, $2, $3) RETURNING *",
        [req.params.id, recipientUser.id, req.user?.id],
      );

      const invitedAttendee: InviteAttendeesProp =
        inviteAttendeeToMoment.rows[0];

      if (invitedAttendee) {
        await sendEmail({
          email: recipientUser.email,
          invite_type: "received",
          invite_target: "moment",
        });
        await sendSMS({
          phone_number: recipientUser.phone_number,
          invite_type: "received",
          invite_target: "moment",
        });
        return res.status(201).send({
          success: true,
          data: invitedAttendee,
        });
      }

      return res.status(404).send("User not found");
    } catch (error) {
      next(error);
    }
  },
);

// User views their moment invites
app.get(
  "/invites/attendees/:attendee_id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user?.id !== req.params.attendee_id) {
        return res
          .status(403)
          .send("Unauthorized: You can only access your own account");
      }

      const getAllInvitesByUser = await pool.query(
        "SELECT * FROM invite_attendees WHERE attendee_id = $1",
        [req.params.attendee_id],
      );

      const invitesForUser: InviteAttendeesProp[] = getAllInvitesByUser.rows;

      if (invitesForUser) {
        return res.status(200).send({
          success: true,
          data: invitesForUser,
        });
      }

      return res.status(404).send("Cannot find user");
    } catch (error) {
      next(error);
    }
  },
);

// Owner views sent moment invites
app.get(
  "/invites/attendees/sent/:invited_by",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user?.id !== req.params.invited_by) {
        return res
          .status(403)
          .send("Unauthorized: You can only access your own account");
      }

      const getAllInvitesByOwner = await pool.query(
        "SELECT * FROM invite_attendees WHERE invited_by = $1",
        [req.params.invited_by],
      );

      const invitesFromOwner: InviteAttendeesProp[] = getAllInvitesByOwner.rows;

      if (invitesFromOwner) {
        return res.status(200).send({
          success: true,
          data: invitesFromOwner,
        });
      }

      return res.status(404).send("Cannot find user");
    } catch (error) {
      next(error);
    }
  },
);

//User Accept or Reject Moment Invite
app.put(
  "/invites/attendees/:id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.status(400).send("Request body cannot be empty.");

    const { status } = req.body;

    try {
      const getAttendeeId = await pool.query(
        "SELECT attendee_id, moment_id FROM invite_attendees WHERE id = $1",
        [req.params.id],
      );

      const attendeeId: InviteAttendeesProp = getAttendeeId.rows[0];

      if (req.user?.id !== attendeeId.attendee_id) {
        return res
          .status(403)
          .send("Unauthorized: You can only access your own account");
      }

      const now = status === "accepted" ? new Date().toISOString() : null;

      const statusDecision = await pool.query(
        `UPDATE invite_attendees SET status = $2, accepted_at = $3 WHERE id = $1 RETURNING *`,
        [req.params.id, status, now],
      );

      const decision: InviteAttendeesProp = statusDecision.rows[0];

      const getOwner = await pool.query(
        `SELECT email, phone_number FROM users WHERE id = $1`,
        [decision.invited_by],
      );

      const owner: UserProp = getOwner.rows[0];

      if (decision.status === "accepted") {
        if (owner) {
          await sendEmail({
            email: owner.email,
            invite_type: "accepted",
            invite_target: "moment",
          });
          await sendSMS({
            phone_number: owner.phone_number,
            invite_type: "accepted",
            invite_target: "moment",
          });
        }
        const addToCircleQuery = await pool.query(
          `INSERT INTO moment_attendees (attendee_id, moment_id) VALUES ($1, $2) RETURNING *`,
          [attendeeId.attendee_id, attendeeId.moment_id],
        );

        const path: InviteAttendeesProp = addToCircleQuery.rows[0];

        if (path) {
          return res.status(201).send({
            success: true,
            data: path,
            message: `${path.attendee_id} added to ${path.moment_id}`,
          });
        }
      }

      if (decision.status === "rejected") {
        if (owner) {
          await sendEmail({
            email: owner.email,
            invite_type: "rejected",
            invite_target: "moment",
          });
          await sendSMS({
            phone_number: owner.phone_number,
            invite_type: "rejected",
            invite_target: "moment",
          });
        }
        return res.status(200).send({
          failed: true,
          message: `${decision.attendee_id} rejected by ${decision.invited_by}`,
        });
      }

      return res.status(400).send("Unable to handle request");
    } catch (error) {
      next(error);
    }
  },
);

//Retrive Active Connection
app.get(
  "/users/:id/connections",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const getActiveConnections = await pool.query(
        `SELECT DISTINCT 
        u.id,
        u.first_name,
        u.last_name,
        u.username,
        u.profile_image,
        c.id as circle_id,
        c.circle_name
      FROM circle_members cm1
      JOIN circle_members cm2 ON cm1.circle_id = cm2.circle_id
      JOIN users u ON cm2.member_id = u.id
      JOIN circles c ON cm1.circle_id = c.id
      WHERE cm1.member_id = $1 AND cm2.member_id != $1
         `,
        [req.params.id],
      );

      const activeConnections: UserProp[] = getActiveConnections.rows;

      if (activeConnections) {
        return res.status(200).send({
          success: true,
          data: activeConnections,
        });
      }

      return res.status(404).send("User not found.");
    } catch (error) {
      next(error);
    }
  },
);

//Transfer Ticket
app.put(
  "/attendee/:attendee_id/transfer/:moment_id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.status(400).send("Request body cannot be empty.");

    const { recipient } = req.body; // username, email, or phone

    try {
      //owner of ticket
      const getTicketOwner = await pool.query(
        `SELECT * FROM invite_attendees 
        WHERE attendee_id = $1 AND moment_id = $2 AND status = 'accepted'`,
        [req.params.attendee_id, req.params.moment_id],
      );

      const owner: UserProp = getTicketOwner.rows[0];

      if (!owner) {
        return res.status(403).send("You do not own this ticket.");
      }

      if (req.user?.id !== req.params.attendee_id) {
        return res.status(403).send("Unauthorized");
      }

      //Transfer ticket
      const findRecipient = await pool.query(
        `SELECT * FROM users WHERE username = $1 OR phone_number = $1 OR email = $1`,
        [recipient],
      );

      const getRecipient: UserProp = findRecipient.rows[0];

      if (getRecipient) {
        const sendTicket = await pool.query(
          //this replaces the current attendee_id
          `UPDATE invite_attendees SET attendee_id = $1 WHERE attendee_id = $2 AND moment_id = $3 RETURNING *`,
          [getRecipient.id, req.params.attendee_id, req.params.moment_id],
        );

        await sendEmail({ email: getRecipient.email, transfer_ticket: true });
        await sendSMS({
          phone_number: getRecipient.phone_number,
          transfer_ticket: true,
        });
        return res.status(200).send({
          success: true,
          data: sendTicket.rows[0],
        });
      }
      return res.status(404).send("Cannot find recipient");
    } catch (error) {
      next(error);
    }
  },
);

//Anthropic Auto-generation
app.post(
  "/ai/generate",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { description } = req.body;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Based on this event description: "${description}"
                
Return ONLY a JSON object with no preamble or markdown:
{
  "principles": [...],
  "expectations": [...],
  "faqs": [{ "question": "...", "answer": "..." }],
  "vibes": ["vibe 1", "vibe 2"]
}

Generate between 3 and 6 items for each array. Vibes between 5 and 10 with 1 word describing the event.
Keep each item to 1-2 sentences. Match the tone of the description.`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content[0].text;
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());

      return res.status(200).send({ success: true, data: parsed });
    } catch (error) {
      next(error);
    }
  },
);

//recap event endpoint
app.post(
  "/ai/recap",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        moment_id,
        moments_name,
        description,
        location_name,
        vibes,
        principles,
      } = req.body;

      // Enrich with real event data
      const [attendeeResult, photoResult, momentResult] = await Promise.all([
        pool.query(
          `SELECT COUNT(*) FROM moment_attendees WHERE moment_id = $1`,
          [moment_id],
        ),
        pool.query(`SELECT COUNT(*) FROM moment_photos WHERE moment_id = $1`, [
          moment_id,
        ]),
        pool.query(
          `SELECT moment_start, moment_end FROM moments WHERE id = $1`,
          [moment_id],
        ),
      ]);

      const attendeeCount = parseInt(attendeeResult.rows[0].count);
      const photoCount = parseInt(photoResult.rows[0].count);
      const moment = momentResult.rows[0];

      const endTime = moment?.moment_end;
      const durationHours =
        moment?.moment_start && endTime
          ? Math.round(
              ((new Date(endTime).getTime() -
                new Date(moment.moment_start).getTime()) /
                (1000 * 60 * 60)) *
                10,
            ) / 10
          : null;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 300,
          messages: [
            {
              role: "user",
              content: `Write a short, evocative 2-3 sentence recap of this event. Make it feel like a memory — cinematic, sensory, present tense. Do not use clichés.

Event: ${moments_name}
Location: ${location_name}
Description: ${description}
Vibes: ${vibes?.join(", ")}
Principles: ${principles?.join(", ")}
Attendees: ${attendeeCount} people
${durationHours ? `Duration: ${durationHours} hours` : ""}
${photoCount > 0 ? `Photos captured: ${photoCount}` : ""}

Return ONLY the recap text, no preamble, no quotes.`,
            },
          ],
        }),
      });

      const data = await response.json();
      const recap = data.content[0].text;

      const getCreator = await pool.query(
        `SELECT email, phone_number FROM users WHERE id = $1`,
        [req.user?.id],
      );
      const creator = getCreator.rows[0];

      await sendEmail({
        email: creator.email,
        moment_recap: {
          moments_name,
          recap,
        },
      });
      await sendSMS({
        phone_number: creator.phone_number,
        moment_recap: { moments_name },
      });

      return res.status(200).send({ success: true, data: { recap } });
    } catch (error) {
      next(error);
    }
  },
);

//Referrals
app.post(
  "/referrals",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { recipient, reason } = req.body;
      const referrer_id = req.user?.id;

      if (!recipient || !reason) {
        return res.status(400).send("recipient and reason are required.");
      }

      // Check referrals available
      const userResult = await pool.query(
        "SELECT referrals_available FROM users WHERE id = $1",
        [referrer_id],
      );

      if (userResult.rows[0].referrals_available <= 0) {
        return res.status(400).send("No referrals available.");
      }

      // Create referral + decrement count
      await pool.query("BEGIN");

      await pool.query(
        "INSERT INTO referrals (referrer_id, recipient, reason) VALUES ($1, $2, $3)",
        [referrer_id, recipient, reason],
      );

      await pool.query(
        "UPDATE users SET referrals_available = referrals_available - 1 WHERE id = $1",
        [referrer_id],
      );

      await pool.query("COMMIT");

      return res.status(201).send({ success: true });
    } catch (error) {
      await pool.query("ROLLBACK");
      next(error);
    }
  },
);

//check-in route
app.post(
  "/moments/:moment_id/checkin",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { moment_id } = req.params;
      const { attendee_id } = req.body;

      if (!attendee_id) {
        return res.status(400).send("attendee_id is required.");
      }

      const momentResult = await pool.query(
        "SELECT creator_id, close_moment, moments_name FROM moments WHERE id = $1",
        [moment_id],
      );

      if (momentResult.rows.length === 0) {
        return res.status(404).send("Moment not found.");
      }

      if (momentResult.rows[0].creator_id !== req.user?.id) {
        return res.status(403).send("Only the creator can check people in.");
      }

      if (momentResult.rows[0].close_moment) {
        return res.status(403).send("This moment is closed.");
      }

      const attendeeResult = await pool.query(
        "SELECT * FROM moment_attendees WHERE moment_id = $1 AND attendee_id = $2",
        [moment_id, attendee_id],
      );

      if (attendeeResult.rows.length === 0) {
        return res.status(404).send("Attendee not found for this moment.");
      }

      if (attendeeResult.rows[0].checked_in) {
        return res.status(400).send("Attendee already checked in.");
      }

      const result = await pool.query(
        "UPDATE moment_attendees SET checked_in = TRUE, checked_in_at = NOW() WHERE moment_id = $1 AND attendee_id = $2 RETURNING *",
        [moment_id, attendee_id],
      );

      const getAttendee = await pool.query(
        `SELECT username, email, phone_number FROM users WHERE id = $1`,
        [attendee_id],
      );
      const attendee = getAttendee.rows[0];

      const getCreator = await pool.query(
        `SELECT email, phone_number FROM users WHERE id = $1`,
        [momentResult.rows[0].creator_id],
      );
      const creator = getCreator.rows[0];

      await sendEmail({
        email: creator.email,
        check_in: {
          moments_name: momentResult.rows[0].moments_name,
          attendee_username: attendee.username,
        },
      });

      await sendSMS({
        phone_number: creator.phone_number,
        check_in: {
          moments_name: momentResult.rows[0].moments_name,
          attendee_username: attendee.username,
        },
      });

      return res.status(200).send({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  },
);

//joining a circle
app.post(
  "/circles/:circle_id/join",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { circle_id } = req.params;

      const result = await pool.query(
        `UPDATE circle_invites 
         SET status = 'accepted', accepted_at = NOW() 
         WHERE circle_id = $1 AND member_id = $2 
         RETURNING *`,
        [circle_id, req.user?.id],
      );

      if (result.rows.length === 0) {
        return res.status(404).send("Invite not found.");
      }

      // Add to circle_members
      await pool.query(
        `INSERT INTO circle_members (circle_id, member_id) 
         VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [circle_id, req.user?.id],
      );

      return res.status(200).send({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  },
);

//Node-cron is a lightweight task scheduler for Node.js applications
// that allows you to execute JavaScript code at specific intervals or times

cron.schedule("*/15 * * * *", async () => {
  try {
    const windowStart = new Date(Date.now() + 45 * 60 * 1000).toISOString();
    const windowEnd = new Date(Date.now() + 75 * 60 * 1000).toISOString();

    const upcoming = await pool.query(
      `SELECT m.moments_name, m.location_name, m.moment_start, ia.attendee_id
      FROM moments m
      JOIN invite_attendees ia ON m.id = ia.moment_id
      WHERE m.moment_start >= $1
      AND m.moment_start <= $2
      AND ia.status = 'accepted'
      AND m.close_moment IS NOT TRUE`,
      [windowStart, windowEnd],
    );

    for (const row of upcoming.rows) {
      const attendee = await pool.query(
        `SELECT email, phone_number FROM users WHERE id = $1`,
        [row.attendee_id],
      );
      if (!attendee.rows[0]) continue;

      const time = new Date(row.moment_start).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      await sendEmail({
        email: attendee.rows[0].email,
        moment_reminder: {
          moments_name: row.moments_name,
          location_name: row.location_name,
          time,
        },
      });
      await sendSMS({
        phone_number: attendee.rows[0].phone_number,
        moment_reminder: {
          moments_name: row.moments_name,
          location_name: row.location_name,
          time,
        },
      });
    }
  } catch (error) {
    console.error("Reminder cron error:", error);
  }
});

// Runs daily at 10 AM — pending invite nudges
cron.schedule("0 10 * * *", async () => {
  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Pending moment invites
    const pendingMoments = await pool.query(
      `SELECT ia.attendee_id, m.moments_name, m.moment_start
      FROM invite_attendees ia
      JOIN moments m ON ia.moment_id = m.id
      WHERE ia.status = 'pending'
      AND ia.created_at <= $1
      AND m.moment_start > NOW()`,
      [yesterday],
    );

    for (const row of pendingMoments.rows) {
      const attendee = await pool.query(
        `SELECT email, phone_number FROM users WHERE id = $1`,
        [row.attendee_id],
      );
      if (!attendee.rows[0]) continue;

      const time = new Date(row.moment_start).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      await sendEmail({
        email: attendee.rows[0].email,
        moment_invite_reminder: { moments_name: row.moments_name, time },
      });
      await sendSMS({
        phone_number: attendee.rows[0].phone_number,
        moment_invite_reminder: { moments_name: row.moments_name, time },
      });
    }

    // Pending circle invites
    const pendingCircles = await pool.query(
      `SELECT im.member_id, c.circle_name
      FROM invite_members im
      JOIN circles c ON im.circle_id = c.id
      WHERE im.status = 'pending'
      AND im.created_at <= $1`,
      [yesterday],
    );

    for (const row of pendingCircles.rows) {
      const member = await pool.query(
        `SELECT email, phone_number FROM users WHERE id = $1`,
        [row.member_id],
      );
      if (!member.rows[0]) continue;

      await sendEmail({
        email: member.rows[0].email,
        circle_invite_reminder: { circle_name: row.circle_name },
      });
      await sendSMS({
        phone_number: member.rows[0].phone_number,
        circle_invite_reminder: { circle_name: row.circle_name },
      });
    }
  } catch (error) {
    console.error("Invite reminder cron error:", error);
  }
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
