import express, { Request, Response } from 'express'
const router = express.Router();
const controllerAuth = require('./../auth/authControllers');
const controllerItems = require('./../items/itemsControllers');


router.all('/router', async (req:Request,res:Response) =>{
    switch (req.query.action){
        case'register': {
            await controllerAuth.register(req,res);
            break;
        }
        case'login':{
            await controllerAuth.login(req,res);
            break;
        }
        case'logout':{
            await controllerAuth.logout(req,res);
            break;
        }
        case'getItems':{
            await controllerItems.getItems(req,res);
            break;
        }
        case'createItem':{
            await controllerItems.addItem(req,res);
            break;
        }
        case'editItem':{
            await controllerItems.changeItem(req,res);
            break;
        }
        case'deleteItem':{
            await controllerItems.deleteItem(req,res);
            break;
        }
    }
})


/** 
router.post('/register', controllerAuth.register);
router.post('/login', controllerAuth.login);
router.post('/logout', controllerAuth.logout);
router.get('/session', controllerAuth.getSession);


router.get('/items', controllerItems.getItems);
router.post('/items', controllerItems.addItem);
router.put('/items', controllerItems.changeItem);
router.delete('/items', controllerItems.deleteItem);
*/
module.exports = router
