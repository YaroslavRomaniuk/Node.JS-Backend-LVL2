import { Request, Response } from 'express';
import { getDB } from '../db/db';
import { User } from '../../models/models';


interface RequestWithSession extends Request {
    session: any;
}


const bcrypt = require('bcryptjs');

export const register = async (req: Request, res: Response) => {
    try {
      const db = getDB();
      const userName = req.body.login;
      const existingUser = await db.collection('users').findOne({ login: userName });
      if (existingUser) {
        return res.status(400).json("Username already exists.");
      }
  
      const hashedPassword = await bcrypt.hash(req.body.pass, 10);
      const user = new User(userName, hashedPassword, []);
      await db.collection('users').insertOne(user);
  
      res.status(200).json({ ok: true });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json("Registration error");
    }
  };

export const login = async (req: RequestWithSession, res: Response) => {
    try{
        const db = getDB();
        const userName = req.body.login;
        let checkUser = await db.collection('users').findOne({"login":userName})
        
        if (checkUser &&  await bcrypt.compare(req.body.pass, checkUser.pass)){
            req.session.login = userName;
            res.status(200).send({ "ok" : true });
        } else {
            res.status(401).send({ error: "not found" })
        }
    } catch (e) {
        return res.status(400).json("Registration error")
    }
} 


export const logout = async (req: RequestWithSession, res: Response) => {
   
        req.session.destroy((err: Error | null) => {
        if (err) {
          res.status(500).send({ "error": `${(err as Error).message}` });
        } else{
        res.send({ ok: true })
        }
    
      });

} 

export const getSession = async (req: RequestWithSession, res: Response) => {
   console.log(JSON.stringify(req.session))
} 