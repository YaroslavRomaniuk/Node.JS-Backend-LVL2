import { Request, Response } from 'express';
import { getDBMySQL } from '../db/db';
import { Db, ObjectId } from 'mongodb';
import { ItemMySQL } from '../../models/models';
import { RowDataPacket } from 'mysql2';

interface RequestWithSession extends Request {
  session: any;
}

let db: Db;

export const getItems = async (req: RequestWithSession, res: Response) => {
  try {
    const login = req.session.login;
    //console.log(login)
    if (!login) {
      return res.status(403).send({ error: 'forbidden' });
    }

    const db = await getDBMySQL();
    const [existingUser] = JSON.parse(JSON.stringify(await db.query('SELECT * FROM users WHERE login = ?', [login])));


    //console.log(existingUser)


    if (existingUser.length > 0) {
      const [user_id] = <RowDataPacket[]> await db.query('SELECT id FROM users WHERE login = ?', login);
      //console.log(user_id[0].id)
      const [items] = await db.query<RowDataPacket[]>('SELECT * FROM items WHERE user_id = ?', user_id[0].id);
      items.forEach(item => {
        item.checked = Boolean(item.checked);
      });
      console.log(items);

      res.status(200).json({ items: items });
    
    } else {
      res.status(404).send({ error: 'User not found' });
    }

  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const addItem = async (req: RequestWithSession, res: Response) => {

  try {
    const db = await getDBMySQL();
    const login = req.session.login;
    console.log("ITEMS LOGIN: " + login) 

    const [user_id] = <RowDataPacket[]> await db.query('SELECT id FROM users WHERE login = ?', login)
    
    const newItem: ItemMySQL = {
      user_id: user_id[0].id,
      text: req.body.text,
      checked: false,
  };



  db.query('INSERT INTO items SET ?', newItem); 

  const [rows] = <RowDataPacket[]> await db.query('SELECT LAST_INSERT_ID() as _id');
  const id = rows[0]._id;
  console.log(id)
  res.status(201).json({ id: id });

  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
  }

};

export const changeItem = async (req: RequestWithSession, res: Response) => {

  try{

    const db = await getDBMySQL();
    const id = req.body.id;
    const text = req.body.text;
    const checked = req.body.checked;

    console.log(checked)

    db.query(`UPDATE items SET text = ?, checked = ? WHERE _id = ?`, [text, checked, id]); 

    res.status(200).json({ ok: true });
    
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
  }

};

export const deleteItem = async (req: RequestWithSession, res: Response) => {
  

  try{
    const db = await getDBMySQL();
    const itemId = req.body.id;
    console.log("ITEMID: " + itemId)
    console.log("BODY: " + JSON.stringify(req.body))
    await db.query('DELETE FROM items WHERE _id = ?', [itemId]);
    res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
  }

};