import { Request, Response } from 'express';
import { getDBMySQL } from '../db/db';
const bcrypt = require('bcryptjs');

// Custom interface that extends the Request interface with session
interface RequestWithSession extends Request {
  session: any;
}

// Function to check if a user exists in the MySQL database
const userExists = async (userName: string) => {
  const db = await getDBMySQL();
  const [existingUser] = JSON.parse(JSON.stringify(await db.query('SELECT * FROM users WHERE login = ?', [userName])));
  return existingUser.length > 0;
}

// Endpoint to register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const userName = req.body.login;
    if (await userExists(userName)) {
      return res.status(400).json("Username already exists.");
    }
    // Hash the user password using bcrypt
    const hashedPassword = await bcrypt.hash(req.body.pass, 10);
    
    // Insert the new user into the MySQL database
    const db = await getDBMySQL();
    await db.query(
      'INSERT INTO users (login, pass) VALUES (?, ?)',
      [userName, hashedPassword]
    );
    // Respond with success status
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json("Registration error");
  }
}

// Endpoint to login a user
export const login = async (req: RequestWithSession, res: Response) => {
  try {
    const userName = req.body.login;
    if (!(await userExists(userName))) {
      return res.status(401).send({ error: "not found" });
    }
    // Check if the provided password matches the one in the database
    const db = await getDBMySQL();
    const [checkUser] = JSON.parse(JSON.stringify(await db.query('SELECT * FROM users WHERE login = ?', [userName])));
    const checkPass = await bcrypt.compare(req.body.pass, checkUser[0].pass);
    if (checkPass) {
      // If password matches, store the user login in the session and respond with success status
      req.session.login = userName;
      return res.status(200).send({ ok: true });
    } else {
      return res.status(401).send({ error: "not found" })
    }
  } catch (e) {
    return res.status(400).json("Registration error")
  }
}

// Endpoint to logout a user
export const logout = async (req: RequestWithSession, res: Response) => {
  // Destroy the session
  req.session.destroy((err: Error | null) => {
    if (err) {
      res.status(500).send({ "error": `${(err as Error).message}` });
    } else {
      res.send({ ok: true })
    }
  });
}

// Endpoint to get the current session
export const getSession = async (req: RequestWithSession, res: Response) => {
  let session = JSON.stringify(req.session.login)
  console.log(session)
  // Respond with the current session
  res.send({ session: session })
} 