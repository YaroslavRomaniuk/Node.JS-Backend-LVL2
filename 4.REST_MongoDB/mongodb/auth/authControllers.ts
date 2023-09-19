import { Request, Response } from 'express';
import { getDB } from '../db/db';
import { User } from '../../models/models';

// Custom request interface that includes session
interface RequestWithSession extends Request {
    session: any;
}

// Importing bcrypt for password hashing
const bcrypt = require('bcryptjs');

// Function to handle user registration 
export const register = async (req: Request, res: Response) => {
    try {
      // Get database instance
      const db = getDB();

      // Extracting username from request body
      const userName = req.body.login;

      // Checking if user already exists
      const existingUser = await db.collection('users').findOne({ login: userName });
      if (existingUser) {
        return res.status(400).json("Username already exists.");
      }
  
      // Hashing the password
      const hashedPassword = await bcrypt.hash(req.body.pass, 10);

      // Creating new user
      const user = new User(userName, hashedPassword, []);

      // Storing the user in database
      await db.collection('users').insertOne(user);
  
      // Sending success response
      res.status(200).json({ ok: true });
    } catch (error) {
      // Logging the error and sending error response
      console.error('Registration error:', error);
      res.status(400).json("Registration error");
    }
};

// Function to handle user login
export const login = async (req: RequestWithSession, res: Response) => {
    try{
        // Get database instance
        const db = getDB();

        // Extracting username from request body
        const userName = req.body.login;

        // Checking if user exists
        let checkUser = await db.collection('users').findOne({"login":userName})
        
        // Verifying the password and sending appropriate response
        if (checkUser &&  await bcrypt.compare(req.body.pass, checkUser.pass)){
            req.session.login = userName;
            res.status(200).send({ "ok" : true });
        } else {
            res.status(401).send({ error: "not found" })
        }
    } catch (e) {
        // Sending error response
        return res.status(400).json("Registration error")
    }
};

// Function to handle user logout
export const logout = async (req: RequestWithSession, res: Response) => {
    // Destroying the session
    req.session.destroy((err: Error | null) => {
        if (err) {
          // Sending error response
          res.status(500).send({ "error": `${(err as Error).message}` });
        } else{
          // Sending success response
          res.send({ ok: true })
        }  
    });
} 

// Function to get the current session
export const getSession = async (req: RequestWithSession, res: Response) => {
   // Logging the session
   console.log(JSON.stringify(req.session))
} 