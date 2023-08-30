import express, { Router } from 'express';
import { register, login, logout, getSession } from './../auth/authControllers';
import { getItems, addItem, changeItem, deleteItem } from './../items/itemsControllers';

const router: Router = express.Router();

router.post('/register', register)
.post('/login', login)
.post('/logout', logout)
.get('/session', getSession);


router.get('/items', getItems)
.post('/items', addItem)
.put('/items', changeItem)
.delete('/items', deleteItem);

module.exports = router
