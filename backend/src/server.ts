import pool from "./db/db.js";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";

const app = express();
const port = "3000";

app.use(express.json());

//create user
app.post("/users", async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) {
    return res.status(400).send("Request body cannot be empty.");
  }
  const { username, email, phoneNumber } = req.body;

  if (!username || !email || !phoneNumber) {
    //this allows you to access the request body and find the null/empty values.
    const missing = ["username", "email", "phoneNumber"].find(
      (field) => !req.body[field],
    );

    return res.status(400).send(`${missing} is required.`);
  }

  try {
    const insertUser = await pool.query(
      'INSERT INTO "User" (username, email, "phoneNumber") VALUES ($1, $2, $3) RETURNING *',
      [username, email, phoneNumber],
    );

    const createUser = insertUser.rows[0];
    return res.status(201).json({
      success: true,
      data: createUser,
    });
  } catch (error) {
    next(error);
  }
});

//update user by id
app.put(
  "/users/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, phoneNumber } = req.body;

    try {
      const changeFields = await pool.query(
        'UPDATE "User" SET username = $2, email = $3, "phoneNumber" = $4 WHERE id = $1 RETURNING *',
        [req.params.id, username, email, phoneNumber],
      );

      const updateUser = changeFields.rows[0];
      return res.status(200).json({
        success: true,
        data: updateUser,
      });
    } catch (error) {
      next(error);
    }
  },
);

//get all users
app.get("/users", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, "phoneNumber", "updatedAt", "createdAt"  FROM "User"',
    );

    const allUsers = result.rows;
    return res.status(200).json({ success: true, data: allUsers });
  } catch (error) {
    next(error);
  }
});

//get user by id
app.get(
  "/users/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await pool.query(
        'SELECT username, email, "phoneNumber" FROM "User" WHERE id = $1',
        [req.params.id],
      );

      const getUser = result.rows[0];
      return res.status(200).json({ success: true, data: getUser });
    } catch (error) {
      next(error);
    }
  },
);

//delete user by id
app.delete(
  "/users/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const removeUser = await pool.query(
        'DELETE FROM "User" WHERE id = $1 RETURNING *',
        [req.params.id],
      );

      const deleteUser = removeUser.rowCount; //number of rows affected by query

      if (deleteUser === 1) {
        return res.status(200).json({
          success: true,
          data: removeUser.rows[0],
          message: "user existed and was deleted",
        });
      } else {
        return res.status(404).send("no user matched that id.");
      }
    } catch (error) {
      next(error);
    }
  },
);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
