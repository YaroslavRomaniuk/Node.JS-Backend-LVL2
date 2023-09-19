import { Request, Response } from 'express';
import { getDBMySQL } from '../db/db';
import { Db } from 'mongodb';
import { ItemMySQL } from '../../models/models';
import { RowDataPacket } from 'mysql2';

// Add a session to the Request interface
interface RequestWithSession extends Request {
  session: any;
}

// Function to get the user ID from the MySQL database
const getUserId = async (login: string) => {
  const db = await getDBMySQL();
  const [user_id] = <RowDataPacket[]>await db.query('SELECT id FROM users WHERE login = ?', login);
  return user_id[0].id;
}

// Get all items for a user
export const getItems = async (req: RequestWithSession, res: Response) => {
  try {
    const login = req.session.login;
    // If the user is not logged in, return a 403 status
    if (!login) {
      return res.status(403).send({ error: 'forbidden' });
    }

    const db = await getDBMySQL();
    const userId = await getUserId(login);

    const [items] = await db.query<RowDataPacket[]>('SELECT * FROM items WHERE user_id = ?', userId);

    res.status(200).json({ items: items });

  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Add a new item for a user
export const addItem = async (req: RequestWithSession, res: Response) => {
  try {
    const login = req.session.login;
    const userId = await getUserId(login);

    const newItem: ItemMySQL = {
      user_id: userId,
      text: req.body.text,
      checked: false,
    };

    const db = await getDBMySQL();

    db.query('INSERT INTO items SET ?', newItem);

    const [rows] = <RowDataPacket[]>await db.query('SELECT LAST_INSERT_ID() as _id');
    const id = rows[0]._id;

    res.status(201).json({ id: id });

  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Change an existing item for a user
export const changeItem = async (req: RequestWithSession, res: Response) => {
  try {
    const { id, text, checked } = req.body;
    const db = await getDBMySQL();
    db.query(`UPDATE items SET text = ?, checked = ? WHERE _id = ?`, [text, checked, id]);
    res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Delete an existing item for a user
export const deleteItem = async (req: RequestWithSession, res: Response) => {
  try {
    const db = await getDBMySQL();
    const itemId = req.body.id;
    await db.query('DELETE FROM items WHERE _id = ?', [itemId]);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
  }
};