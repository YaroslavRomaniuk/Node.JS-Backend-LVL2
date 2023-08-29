import express from 'express'
const router = express.Router();
const controllerAuth = require('./../auth/authControllers');
const controllerItems = require('./../items/itemsControllers');

router.post('/register', controllerAuth.register);
router.post('/login', controllerAuth.login);
router.post('/logout', controllerAuth.logout);
router.get('/session', controllerAuth.getSession);


router.get('/items', controllerItems.getItems);
router.post('/items', controllerItems.addItem);
router.put('/items', controllerItems.changeItem);
router.delete('/items', controllerItems.deleteItem);

module.exports = router
