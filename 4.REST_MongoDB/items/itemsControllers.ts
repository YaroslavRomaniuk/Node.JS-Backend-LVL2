import { Request, Response } from 'express';

const { connectToDb, getDB } = require('./../db');
import { Db, Collection, ObjectId } from 'mongodb';
import { Item } from '../models/models';

interface RequestWithSession extends Request {
    session: any;
}



let db: Db;

const bcrypt = require('bcryptjs');

exports.getItems_old = async (req: RequestWithSession, res: Response) => {
    

    //let login = true;
    let login = req.session.login;
    let session = req.session
    //req.session.save()
    console.log("GET ITEMS SESSION: " + JSON.stringify(req.session))
    console.log("GET ITEMS LOGIN: " + login)
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
    

    //let login = true;
    let login = req.session.login;
    let session = req.session
    //req.session.save()
    console.log("GET ITEMS SESSION: " + JSON.stringify(req.session))
    console.log("GET ITEMS LOGIN: " + login)
    if (login){
        db = getDB();
        let users = db.collection('users');
        let user = await users.findOne({ login: login })
        if(user){
            console.log(user.items)
            res.status(200).json({ items: user.items });
        }

        /** 
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
        */
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

/** 
    db.collection('todos')
        .insertOne(newItem)
        .then(result => {
            res.status(201).json({ id: result.insertedId });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
        */
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

    /** 
    const updatedItem: Item = {
        _id: itemId,
        text: req.body.text,
        checked: req.body.checked
    };
    console.log(updatedItem)

    db.collection('todos')
        .updateOne(
            { _id: new ObjectId(itemId) },
            { $set: updatedItem }
        )
        .then(() => {
            res.status(200).json({ "ok": true });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
        */
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