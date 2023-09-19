import express, { Router, Request, Response  } from 'express';
import { register, login, logout } from '../auth/authControllers';
import { getItems, addItem, changeItem, deleteItem } from '../items/itemsControllers';

// Initialize a router instance
const router: Router = express.Router();

// Define a single route that can handle all actions based on the 'action' query parameter
router.all('/router', async (req: Request, res: Response) => {
    try {
      // Use a switch statement to handle different actions
      switch (req.query.action) {
        case 'register': {
          // If action is 'register', call the register function
          await register(req, res);
          break;
        }
        case 'login': {
          // If action is 'login', call the login function
          await login(req, res);
          break;
        }
        case 'logout': {
          // If action is 'logout', call the logout function
          await logout(req, res);
          break;
        }
        case 'getItems': {
          // If action is 'getItems', call the getItems function
          await getItems(req, res);
          break;
        }
        case 'createItem': {
          // If action is 'createItem', call the addItem function
          await addItem(req, res);
          break;
        }
        case 'editItem': {
          // If action is 'editItem', call the changeItem function
          await changeItem(req, res);
          break;
        }
        case 'deleteItem': {
          // If action is 'deleteItem', call the deleteItem function
          await deleteItem(req, res);
          break;
        }
        default: {
          // If action is not recognized, respond with a 400 status
          res.status(400).send('Invalid action');
          break;
        }
      }
    } catch (error) {
      // If any error occurs, log it and respond with a 500 status
      console.error('Internal Server Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });

// Export the router
module.exports = router;