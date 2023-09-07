import { Request, Response } from 'express';
import { getDBMySQL } from '../db/db';
import { Db, ObjectId } from 'mongodb';
import { Item } from '../../models/models';

interface RequestWithSession extends Request {
  session: any;
}

let db: Db;

export const getItems = async (req: RequestWithSession, res: Response) => {
  try {
    const login = req.session.login;

    if (!login) {
      return res.status(403).send({ error: 'forbidden' });
    }

    const db = await getDBMySQL();
    const [existingUser] = JSON.parse(JSON.stringify(await db.query('SELECT * FROM users WHERE login = ?', [login])));
    console.log(existingUser)
    if (existingUser.length > 0) {
      res.status(200).json({ ok: true });
    } else {
      res.status(404).send({ error: 'User not found' });
    }

  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const addItem = async (req: RequestWithSession, res: Response) => {

};

export const changeItem = async (req: RequestWithSession, res: Response) => {

};

export const deleteItem = async (req: RequestWithSession, res: Response) => {

};