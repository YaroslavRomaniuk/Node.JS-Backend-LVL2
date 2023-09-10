import { Request, Response } from 'express';
import { getDB } from '../db/db';
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

        const db = getDB();
        const users = db.collection('users');
        const user = await users.findOne({ login });
        

        if (user) {
            res.status(200).json({ items: user.items });
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
        const db = getDB();
        const itemID = new ObjectId();
        const newItem: Item = {
            _id: itemID,
            text: req.body.text,
            checked: false,
        };
        const login = req.session.login;
        const users = db.collection('users');

        const result = await users.updateOne(
            { login },
            { $push: { items: newItem } }
        );

        if (result.modifiedCount === 1) {
            res.status(201).json({ id: itemID });
        } else {
            res.status(500).send('Failed to add item');
        }
    } catch (error) {
        console.error('Internal Server Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const changeItem = async (req: RequestWithSession, res: Response) => {
    try {
      const db = getDB();
      const itemId = req.body.id;
      const login = req.session.login;
      const users = db.collection('users');
  
      console.log(req.body.checked)
      const result = await users.updateOne(
        { login, "items._id": new ObjectId(itemId) },
        {
          $set: {
            "items.$.text": req.body.text,
            "items.$.checked": req.body.checked
          }
        }
      );
  
      if (result.modifiedCount === 1) {
        res.status(200).json({ ok: true });
      } else {
        res.status(500).send('Failed to change item');
      }
    } catch (error) {
      console.error('Internal Server Error:', error);
      res.status(500).send('Internal Server Error');
    }
  };

  export const deleteItem = async (req: RequestWithSession, res: Response) => {
    try {
      const db = getDB();
      const itemId = req.body.id;
      console.log("ITEMID: " + itemId)
      console.log("BODY: " + JSON.stringify(req.body))


      const login = req.session.login;
      const users = db.collection('users');
  
      const result = await users.updateOne(
        { login },
        {
          $pull: {
            items: { _id: new ObjectId(itemId) }
          }
        }
      );
  
      if (result.modifiedCount === 1) {
        res.status(200).json({ ok: true });
      } else {
        res.status(500).send('Failed to delete item');
      }
    } catch (error) {
      console.error('Internal Server Error:', error);
      res.status(500).send('Internal Server Error');
    }
  };