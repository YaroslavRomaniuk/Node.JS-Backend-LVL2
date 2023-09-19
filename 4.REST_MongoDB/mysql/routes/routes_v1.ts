import express, { Router } from 'express';
import { register, login, logout, getSession } from '../auth/authControllers';
import { getItems, addItem, changeItem, deleteItem } from '../items/itemsControllers';

// Initialize a router instance
const router: Router = express.Router();

// Define routes for authentication
router
  .post('/register', register)
  .post('/login', login)
  .post('/logout', logout)
  .get('/session', getSession);

// Define routes for item management
router
  .get('/items', getItems)
  .post('/items', addItem)
  .put('/items', changeItem)
  .delete('/items', deleteItem);

// Export the router
module.exports = router;