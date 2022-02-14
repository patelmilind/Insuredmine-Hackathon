'use strict';

var express = require('express');
var {show, create, getForm} = require('./forms.controller');

var router = express.Router();

router.get('/allForms', show);
// router.get('/:id', controller.show);
router.post('/', create);
// router.put('/:id', controller.upsert);
// router.patch('/:id', controller.patch);
router.get('/getform/:id', getForm);

module.exports = router;
