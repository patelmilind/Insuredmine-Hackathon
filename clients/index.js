'use strict';

var express = require('express');
var {show, create, destroy} = require('./clients.controller');

var router = express.Router();

router.get('/', show);
// router.get('/:id', controller.show);
router.post('/', create);
// router.put('/:id', controller.upsert);
// router.patch('/:id', controller.patch);
router.delete('/:id', destroy);

module.exports = router;
