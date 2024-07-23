import { Request, Response } from 'express';
import { getDB } from '../db/db';
import { Db, ObjectId } from 'mongodb';
import { Item } from '../../models/models';

// Custom interface that extends the Request interface with session
interface RequestWithSession extends Request {
  session: any;
}

// Database instance
let db: Db;

// Endpoint to get all items for a user
export const getItems = async (req: RequestWithSession, res: Response) => {
  try {
    // Extract user login from session
    const login = req.session.login;

    // If user is not logged in, respond with 403 status 
    if (!login) {
      return res.status(403).send({ error: 'forbidden' });
    }

    // Get database instance and users collection
    const db = getDB();
    const users = db.collection('users');

    // Find the user in the collection
    const user = await users.findOne({ login });

    // If user is found, respond with user's items, else respond with 404 status
    if (user) {
      res.status(200).json({ items: user.items });
    } else {
      res.status(404).send({ error: 'User not found' });
    }

  } catch (error) {
    // Log the error and respond with 500 status
    console.error('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Endpoint to add a new item for a user
export const addItem = async (req: RequestWithSession, res: Response) => {
  try {
    // Get database instance and create a new Item object
    const db = getDB();
    const itemID = new ObjectId();
    const newItem: Item = {
      _id: itemID,
      text: req.body.text,
      checked: false,
    };

    // Extract user login from session and get users collection
    const login = req.session.login;
    const users = db.collection('users');

    // Update the user's items with the new item
    const result = await users.updateOne(
      { login },
      { $push: { items: newItem } }
    );

    // If update is successful, respond with 201 status and the new item's ID, else respond with 500 status
    if (result.modifiedCount === 1) {
      res.status(201).json({ id: itemID });
    } else {
      res.status(500).send('Failed to add item');
    }
  } catch (error) {
    // Log the error and respond with 500 status
    console.error('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Endpoint to change an item for a user
export const changeItem = async (req: RequestWithSession, res: Response) => {
  try {
    // Get database instance, extract item ID and user login from the request
    const db = getDB();
    const itemId = req.body.id;
    const login = req.session.login;
    const users = db.collection('users');

    // Update the item's text and checked status in the user's items
    const result = await users.updateOne(
      { login, "items._id": new ObjectId(itemId) },
      {
        $set: {
          "items.$.text": req.body.text,
          "items.$.checked": req.body.checked
        }
      }
    );

    // If update is successful, respond with 200 status, else respond with 500 status
    if (result.modifiedCount === 1) {
      res.status(200).json({ ok: true });
    } else {
      res.status(500).send('Failed to change item');
    }
  } catch (error) {
    // Log the error and respond with 500 status
    console.error('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Function to delete an item for a user
export const deleteItem = async (req: RequestWithSession, res: Response) => {
  try {
    // Get the database connection
    const db = getDB();
    
    // Extract the item ID from the request body
    const itemId = req.body.id;

    // Extract the user's login from the session
    const login = req.session.login;
    
    // Get access to the 'users' collection
    const users = db.collection('users');

    // Update the user document by pulling from the 'items' array the item that matches the provided item ID
    const result = await users.updateOne(
      { login },
      {
        $pull: {
          items: { _id: new ObjectId(itemId) }
        }
      }
    );

    // If the document was modified successfully, return a success response, otherwise respond with a server error
    if (result.modifiedCount === 1) {
      res.status(200).json({ ok: true });
    } else {
      res.status(500).send('Failed to delete item');
    }
  } catch (error) {
    // Log the error and respond with a server error
    console.error('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
  }
};




