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

app.use(limiter);
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

//Create Appplication
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

//get all applications
app.get(
  "/applications",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const applications = pool.query("SELECT * FROM applications");
      const allApplications = (await applications).rows;
      return res.status(200).send({ success: true, data: allApplications });
    } catch (error) {
      next(error);
    }
  },
);

//OTP status merger
const otpMerge = async (
  status: string,
  req: Request<ApplicationProp>,
  res: Response,
  next: NextFunction,
) => {
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

      return res.status(200).send({
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

      return res.status(200).send("Application rejected");
    }
  } catch (error) {
    next(error);
  }
};

//Update status applications based on id
app.put(
  "/applications/:id",
  async (req: Request<ApplicationProp>, res: Response, next: NextFunction) => {
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
        otpMerge(updateStatus.status, req, res, next);
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

//get users by id
app.get(
  "/users/:id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
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

//verify user from otp login
app.post(
  "/auth/verify/",
  limiter,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query) return res.status(400).send("Request body cannot be empty");

    const { id } = req.query;
    const { otp_code } = req.body;

    try {
      const isUserLocked = await pool.query(
        `SELECT locked FROM users WHERE id = $1`,
        [id],
      );

      const lockedUser: UserProp = isUserLocked.rows[0];

      if (lockedUser.locked === true) {
        return res.status(429).send("User Locked!");
      }

      const authUser = await pool.query(
        `SELECT email, otp_code, otp_expiry, username, id, created_at FROM users WHERE id = $1 AND otp_code = $2 AND otp_expiry > NOW()`,
        [id, otp_code],
      );

      const UserAuthorize: UserProp = authUser.rows[0];

      if (UserAuthorize) {
        const authorize = jwt.sign(
          {
            username: UserAuthorize.username,
            id: UserAuthorize.id,
            created_at: UserAuthorize.created_at,
          },
          `${process.env.JWT_SECRET_KEY}`,
          {
            expiresIn: "1y",
          },
        );

        await pool.query(
          `UPDATE users SET otp_code = null, otp_expiry = null, otp_attempts = 0 WHERE id = $1;`,
          [id],
        );

        return res.status(201).send({
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

//resend OTP request if expired or didn't recieve
app.put(
  "/auth/resend/:id",
  async (req: Request<UserProp>, res: Response, next: NextFunction) => {
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

//update user information by id
app.put(
  "/users/:id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return res.status(400).send("Request body cannot be empty");

    const userKeys = Object.keys(req.body)
      .map((key, index) => {
        return `${key} = $${index + 2}`;
      })
      .join(", ");

    try {
      const updateUserInformation = await pool.query(
        `UPDATE users SET ${userKeys} WHERE id = $1 RETURNING *`,
        [req.params.id, ...Object.values(req.body)],
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

//delete user by id
app.delete(
  "/users/:id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userDeletion = await pool.query(
        `DELETE FROM users WHERE id = $1 RETURNING *`,
        [req.params.id],
      );

      const deleteUser: UserProp = userDeletion.rows[0];

      if (deleteUser) {
        return res.status(200).send({
          success: true,
          data: deleteUser,
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

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
