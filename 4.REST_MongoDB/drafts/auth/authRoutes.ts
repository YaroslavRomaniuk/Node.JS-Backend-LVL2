//const express = require('express');
//const router = express.Router();
//const controller = require('./authControllers');


router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/logout', controller.login);

module.exports = router
