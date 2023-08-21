import { Request, Response } from 'express';

const { connectToDb, getDB } = require('./../db');
import { Db, Collection, ObjectId } from 'mongodb';
import { Item } from '../models/models';

interface RequestWithSession extends Request {
    session: any;
}



let db: Db;

const bcrypt = require('bcryptjs');

exports.getItems = async (req: RequestWithSession, res: Response) => {
    db = getDB();




    let login = true;
    //let login = req.session.login;
    //req.session.save()
    //console.log(login)
    if (login){
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

exports.addItem = async (req: RequestWithSession, res: Response) => {
    db = getDB();
    const newItem: Item = {

        text: req.body.text,
        checked: false,
    };

    db.collection('todos')
        .insertOne(newItem)
        .then(result => {
            res.status(201).json({ id: result.insertedId });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
}

exports.changeItem = async (req: RequestWithSession, res: Response) => {

    db = getDB();
    const itemId = req.body.id;


    const updatedItem: Item = {
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
}

exports.deleteItem = async (req: RequestWithSession, res: Response) => {

    db = getDB();
    const itemId = req.body.id;
    console.log(itemId)
    db.collection('todos')
        .deleteOne({ _id: new ObjectId(itemId) })
        .then(() => {
            res.status(200).json({ "ok": true });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
}