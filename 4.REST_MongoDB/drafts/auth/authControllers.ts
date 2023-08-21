import { Request, Response } from 'express';
const {connectToDb, getDB} = require('./../db');
import { Db, Collection, ObjectId } from 'mongodb';
import { User } from './userModel';

interface RequestWithSession extends Request {
    session: any;
  }



let db: Db;
const bcrypt = require('bcryptjs');

exports.register = async (req: Request, res: Response) => {
    try{
        db = getDB();
        const userName = req.body.login;
        console.log(req.body)
        let checkName = await db.collection('users').findOne({"login":userName})
        if (checkName){
            return res.status(400).json("Username already exists.")
        }
    
        const hashedPassword = await bcrypt.hash(req.body.pass, 10);
        
        const user = new User(userName, hashedPassword);
        
        await db.collection('users').insertOne(user);

        res.status(200).json({ "ok" : true });
    } catch (e) {
        return res.status(400).json("Registration error")
    }
}

exports.login = async (req: RequestWithSession, res: Response) => {
    try{
        db = getDB();
        const userName = req.body.login;
        let checkUser = await db.collection('users').findOne({"login":userName})
        
        if (checkUser &&  await bcrypt.compare(req.body.pass, checkUser.pass)){
            req.session.login = userName;
            res.status(200).json({ "ok" : true });
        } else {
            res.status(401).send({ error: "not found" })
        }
    } catch (e) {
        return res.status(400).json("Registration error")
    }
} 


exports.logout = async (req: RequestWithSession, res: Response) => {
    req.session.destroy((err: Error | null) => {
        if (err) {
          res.status(500).send({ "error": `${(err as Error).message}` });
        } else{
        res.send({ ok: true })
        }
        
      });
} 