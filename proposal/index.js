'use strict';

var express = require('express');
var {getClientProposals, create, getProposal, updateProposalStatus, sendProposals, extractFromPdf} = require('./proposal.controller');

var router = express.Router();

router.get('/:id', getClientProposals);
router.get('/preview/:id', getProposal);
router.get('/acceptedTrack/:id', updateProposalStatus);
router.post('/', create);
router.post('/send/:id', sendProposals);
router.post('/extractFromPdf', extractFromPdf);
// router.put('/:id', controller.upsert);
// router.patch('/:id', controller.patch);
// router.delete('/:id', controller.destroy);

module.exports = router;
