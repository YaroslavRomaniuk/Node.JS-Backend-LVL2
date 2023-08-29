import { Request, Response } from 'express';

const { getDB } = require('./../db');
import { Db, ObjectId } from 'mongodb';
import { Item } from '../models/models';

interface RequestWithSession extends Request {
    session: any;
}



let db: Db;

const bcrypt = require('bcryptjs');

exports.getItems_old = async (req: RequestWithSession, res: Response) => {
    

 
    let login = req.session.login;
 
    if (login){
        db = getDB();
        db.collection('todos')
        .find()
        .toArray()
        .then((todos) => {

            res.status(200).json({ items: todos });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
    } else {
        res.status(403).send({ error: 'forbidden' });
    }
    
}

exports.getItems = async (req: RequestWithSession, res: Response) => {
    

  
    let login = req.session.login;

    if (login){
        db = getDB();
        let users = db.collection('users');
        let user = await users.findOne({ login: login })
        if(user){
            console.log(user.items)
            res.status(200).json({ items: user.items });
        }

    } else {
        res.status(403).send({ error: 'forbidden' });
    }
    
}

exports.addItem = async (req: RequestWithSession, res: Response) => {
    db = getDB();
    let itemID = new ObjectId;
    const newItem: Item = {
        _id: itemID,
        text: req.body.text,
        checked: false,
    };
    let login = req.session.login;
    let users = db.collection('users');
    const result = await users.updateOne(
        { login: login },
        { $push: { items: newItem } }
      );
    res.status(201).json({ id: itemID });
}




exports.changeItem = async (req: RequestWithSession, res: Response) => {

    db = getDB();
    const itemId = req.body.id;
    let login = req.session.login;
    let users = db.collection('users');
    users.updateOne(
      { login: login, "items._id": new ObjectId(itemId) },
      {
        $set: {
          "items.$.text": req.body.text,
          "items.$.checked": req.body.checked
        }
      }
    );
    res.status(200).json({ "ok": true });
}

exports.deleteItem = async (req: RequestWithSession, res: Response) => {

    db = getDB();
    const itemId = req.body.id;
    let login = req.session.login;
    let users = db.collection('users');
    users.updateOne(
      { login: login},
      {
        $pull: {
          items: { _id: new ObjectId(itemId) }
        }
      }
    );
    res.status(200).json({ "ok": true });
}