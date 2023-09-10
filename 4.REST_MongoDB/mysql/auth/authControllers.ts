import { Request, Response } from 'express';
import { getDBMySQL } from '../db/db';


interface RequestWithSession extends Request {
  session: any;
}

const bcrypt = require('bcryptjs');

export const register = async (req: Request, res: Response) => {
  try {
    const db = await getDBMySQL();
    const userName = req.body.login;
    const [existingUser] = JSON.parse(JSON.stringify(await db.query('SELECT * FROM users WHERE login = ?', [userName])));
    console.log(existingUser)
    if (existingUser.length > 0) {
      return res.status(400).json("Username already exists.");
    }
    const hashedPassword = await bcrypt.hash(req.body.pass, 10);
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
    const db = await getDBMySQL();
    const userName = req.body.login;
    const [checkUser] = JSON.parse(JSON.stringify(await db.query('SELECT * FROM users WHERE login = ?', [userName])));
    //console.log(checkUser[0].pass)
    //console.log(checkUser.length)
    //console.log(await bcrypt.compare(req.body.pass, checkUser[0].pass))

    let checkPass = await bcrypt.compare(req.body.pass, checkUser[0].pass);
    //console.log(checkUser.length)
    //console.log(checkPass)
    if (checkUser.length > 0 && checkPass) {
      console.log("Bubbbaaa")
      req.session.login = userName;
      return res.status(200).send({ "ok": true });
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