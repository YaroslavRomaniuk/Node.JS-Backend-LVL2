import { Request, Response } from 'express';
import { getDBMySQL } from '../db/db';
import { User } from '../../models/models';


interface RequestWithSession extends Request {
    session: any;
}


const bcrypt = require('bcryptjs');

export const register = async (req: Request, res: Response) => {
   try{
    const db = await getDBMySQL();
    const userName = req.body.login;
    const existingUser = await db.execute('SELECT * FROM users WHERE login = ?', [login]);
    console.log(existingUser)


    res.status(200).json({ ok: true });
   } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json("Registration error");
  }
}

export const login = async (req: RequestWithSession, res: Response) => {
    
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