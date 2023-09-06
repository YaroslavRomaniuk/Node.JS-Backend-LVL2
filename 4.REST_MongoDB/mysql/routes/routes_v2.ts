import express, { Router, Request, Response  } from 'express';
import { register, login, logout } from '../auth/authControllers';
import { getItems, addItem, changeItem, deleteItem } from '../items/itemsControllers';

const router: Router = express.Router();


router.all('/router', async (req: Request, res: Response) => {
    try {
      switch (req.query.action) {
        case 'register': {
          await register(req, res);
          break;
        }
        case 'login': {
          await login(req, res);
          break;
        }
        case 'logout': {
          await logout(req, res);
          break;
        }
        case 'getItems': {
          await getItems(req, res);
          break;
        }
        case 'createItem': {
          await addItem(req, res);
          break;
        }
        case 'editItem': {
          await changeItem(req, res);
          break;
        }
        case 'deleteItem': {
          await deleteItem(req, res);
          break;
        }
        default: {
          res.status(400).send('Invalid action');
          break;
        }
      }
    } catch (error) {
      console.error('Internal Server Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router
