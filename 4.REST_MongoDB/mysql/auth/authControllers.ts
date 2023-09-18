import { Request, Response } from 'express';
import { getDBMySQL } from '../db/db';
const bcrypt = require('bcryptjs');

interface RequestWithSession extends Request {
  session: any;
}

const userExists = async (userName: string) => {
  const db = await getDBMySQL();
  const [existingUser] = JSON.parse(JSON.stringify(await db.query('SELECT * FROM users WHERE login = ?', [userName])));
  return existingUser.length > 0;
}

export const register = async (req: Request, res: Response) => {
  try {
    const userName = req.body.login;
    if (await userExists(userName)) {
      return res.status(400).json("Username already exists.");
    }
    const hashedPassword = await bcrypt.hash(req.body.pass, 10);
    const db = await getDBMySQL();
    await db.query(
      'INSERT INTO users (login, pass) VALUES (?, ?)',
      [userName, hashedPassword]
    );
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json("Registration error");
  }
}

export const login = async (req: RequestWithSession, res: Response) => {

  try {
    const userName = req.body.login;
    if (!(await userExists(userName))) {
      return res.status(401).send({ error: "not found" });
    }
    const db = await getDBMySQL();
    const [checkUser] = JSON.parse(JSON.stringify(await db.query('SELECT * FROM users WHERE login = ?', [userName])));
    const checkPass = await bcrypt.compare(req.body.pass, checkUser[0].pass);
    if (checkPass) {
      req.session.login = userName;
      return res.status(200).send({ ok: true });
    } else {
      return res.status(401).send({ error: "not found" })
    }

  } catch (e) {
    return res.status(400).json("Registration error")
  }

}


export const logout = async (req: RequestWithSession, res: Response) => {

  req.session.destroy((err: Error | null) => {
    if (err) {
      res.status(500).send({ "error": `${(err as Error).message}` });
    } else {
      res.send({ ok: true })
    }

  });

}

export const getSession = async (req: RequestWithSession, res: Response) => {
  let session = JSON.stringify(req.session.login)
  console.log(session)
  res.send({ session: session })
} 