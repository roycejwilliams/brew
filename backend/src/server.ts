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

const app = express();
const port = "3000";

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

// function to geneate a 6 digit verifcation code between 100000 to 999999
function generateOTP() {
  return randomInt(100000, 1000000);
}

interface ApplicationProp {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  work_link: string;
  reason: string;
  status: "pending" | "accepted" | "rejected";
}

interface UserProp {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  description: string;
  username: string;
  profile_image: string;
  otp_code: string;
  otp_expiry: Date;
  created_at: Date;
  application_id: ApplicationProp;
  otp_attempts: number;
  locked: boolean;
  role: string;
}

interface CircleProp {
  owner_id: string;
  circle_name: string;
  circle_image: string;
  created_at: Date;
  updated_at: Date;
}

interface Point {
  latitude: number;
  longitude: number;
}

interface MomentProp {
  creator_id: string;
  circle_id: CircleProp;
  image: string;
  moments_name: string;
  created_at: Date;
  update_at: Date;
  moment_starts: Date;
  moment_ends: Date;
  description: string;
  location: Point;
  cap_attendance: number;
  close_moment: boolean;
  visibility_type: "nearby" | "circle" | "people";
}

interface InviteMembersProp {
  member_id: string;
  circle_id: string;
  create_at: Date;
  accepted_at: Date;
  invite_by: string;
  status: "pending" | "accepted" | "rejected";
}

interface InviteAttendeesProp {
  attendee_id: string;
  moment_id: string;
  created_at: Date;
  accepted_at: Date;
  invited_by: string;
  status: "pending" | "accepted" | "rejected";
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
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send("No token provided");

  jwt.verify(token, process.env.JWT_SECRET_KEY!, (err, user) => {
    if (err) return res.status(403).send("Invalid or expired token");

    req.user = user as UserProp;
    next();
  });
};

// Defining user role
const userRole = (role: string) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = req.user?.role;
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
app.post(
  "/applications",
  async (req: Request<ApplicationProp>, res: Response, next: NextFunction) => {
    if (!req.body) {
      return res.status(400).send("Request body cannot be empty.");
    }

    const { first_name, last_name, email, phone_number, work_link, reason } =
      req.body;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone_number ||
      !work_link ||
      !reason
    ) {
      const missing = [
        "first_name",
        "last_name",
        "email",
        "phone_number",
        "work_link",
        "reason",
      ].find((field) => !req.body[field]);

      return res.status(400).send(`${missing} is required.`);
    }

    try {
      const insertApp = await pool.query(
        "INSERT INTO applications (first_name, last_name, email, phone_number, work_link, reason) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [first_name, last_name, email, phone_number, work_link, reason],
      );

      const createApp = insertApp.rows[0];
      return res.status(201).send({
        success: true,
        data: createApp,
      });
    } catch (error) {
      next(error);
    }
  },
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
        console.log(acceptedUser);

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
        otpMerge(updateStatus.status);
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
app.post(
  "/auth/verify/",
  limiter,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query)
      return res.status(400).send("Request query cannot be empty");

    const { id } = req.query;

    const { otp_code } = req.body;

    try {
      const isUserLocked = await pool.query(
        `SELECT locked FROM users WHERE id = $1`,
        [id],
      );

      const lockedUser: UserProp = isUserLocked.rows[0];

      if (lockedUser.locked) {
        return res.status(429).send("User Locked!");
      }

      const authUser = await pool.query(
        `SELECT email, otp_code, otp_expiry, username, id, created_at, role FROM users WHERE id = $1 AND otp_code = $2 AND otp_expiry > NOW()`,
        [id, otp_code],
      );

      const UserAuthorize: UserProp = authUser.rows[0];

      if (UserAuthorize) {
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

        await pool.query(
          `UPDATE users SET otp_code = null, otp_expiry = null, otp_attempts = 0 WHERE id = $1 RETURNING *`,
          [id],
        );

        return res.status(200).send({
          success: true,
          data: authorize,
        });
      }

      const attempts = await pool.query(
        `UPDATE users
         SET otp_attempts = otp_attempts + 1,
           locked = CASE
           WHEN otp_attempts + 1 >= 5 THEN true ELSE false END
         WHERE id = $1
         RETURNING otp_attempts, locked`,
        [id],
      );

      const lockAttempts: UserProp = attempts.rows[0];

      console.log("lock attempts:", lockAttempts);

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

      console.log(updatedOTP);

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
        `SELECT owner_id FROM circles WHERE circle_id = $1`,
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

    const { moments_name, location, moment_starts, visibility_type } = req.body;

    if (!moments_name || !location || !moment_starts || !visibility_type) {
      const missing = [
        "moments_name",
        "location",
        "moment_start",
        "visibility_type",
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
        "INSERT INTO moments (creator_id, moments_name, location, moment_starts, visibility_type) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [req.params.id, moments_name, location, moment_starts, visibility_type],
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

// Update moment details by user id
app.put(
  "/moments/:id/:moment_id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.status(400).send("Request body cannot be empty");

    const allowed = [
      "image",
      "moments_name",
      "moment_start",
      "moment_end",
      "description",
      "location",
      "cap_attendance",
      "close_moment",
      "visibility_type",
    ];

    //returns the desired keys
    const filteredKeys = Object.keys(req.body).filter((key) => {
      return allowed.includes(key);
    });

    //returns the desired values based on filtered keys.. goes in the dependency
    const valueOfKeys = filteredKeys.map((value) => req.body[value]);

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

//INVITE CIRCLE FLOW
// Owner invites a member to a circle
app.post(
  "/circles/:id/invite/:member_id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.status(400).send("Request body cannot be empty.");

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

      const invitedMember: UserProp = inviteMemberToCircle.rows[0];

      if (invitedMember) {
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
  "/invites/members/:invited_by",
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

      if (decision.status === "accepted") {
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
// Owner invites a member to a moment
app.post(
  "/moment/:id/invite/:attendee_id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.status(400).send("Request body cannot be empty.");

    try {
      const invitedBy = await pool.query(
        `SELECT creator_id FROM moments WHERE id = $1`,
        [req.params.id],
      );

      const ownerOfMoment: MomentProp = invitedBy.rows[0];

      if (req.user?.id !== ownerOfMoment.creator_id) {
        return res
          .status(403)
          .send("Unauthorized: You can only access your own account");
      }

      const inviteAttendeeToMoment = await pool.query(
        "INSERT INTO invite_attendees (moment_id, attendee_id, invited_by) VALUES ($1, $2, $3) RETURNING *",
        [req.params.id, req.params.attendee_id, ownerOfMoment.creator_id],
      );

      const invitedAttendee: UserProp = inviteAttendeeToMoment.rows[0];

      if (invitedAttendee) {
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

      if (decision.status === "accepted") {
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

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
