'use strict';
// import uniqid from 'uniqid';
const uniqid = require('uniqid');
const fs = require('fs');
const handlebars = require('handlebars');
//  var agents = require('../agents.json')

let category = ['Home','Auto'];

let savedProposals = [];
let ngrok = 'https://e47d-103-127-20-132.ngrok.io';
// Gets a list of proposal for the client
function getClientProposals(req, res) {
    let clientId = req.params.id;
    let clientProposals = savedProposals.filter(ele => ele.clientId == clientId);
    res.json(clientProposals);
}
 
// Creates a new proposal
function create(req, res) {
    let _id = uniqid();
    req.body['_id'] = _id;
    let proposalName = req.body.proposalName;
    let clientId = req.body.clientId;
    let category = req.body.category;
    let template = req.body.template;
    let formRes = req.body.formRes;

    savedProposals.push(req.body);

    res.send({"Proposal_id":_id});
}

function getProposal(req, res) {
    console.log("savedProposals",savedProposals);
    console.log("response id = ",req.params._id);
    let proposalData = savedProposals.filter(ele => ele._id == req.params.id);
    console.log("proposalData --",proposalData);
    const templatePath = __dirname + '/templates/home/h1.html';
    const html = fs.readFileSync(templatePath, 'utf8');
    let template = handlebars.compile(html);
    const finalTemplate = template({ insuranceType: proposalData[0].category,acceptUrl:`${ngrok}/api/proposal/acceptedTrack/${req.params.id}` });
    console.log("finalTemplate --> ",finalTemplate);
    res.send(finalTemplate);
}

function updateProposalStatus(req, res) {
    let proposalId = req.params.id;
    console.log("proposalId --> ",proposalId," was accepted by client!!");
    //update the status of the proposal to accepted
}

function sendProposals(req,res) {
    let proposalId = req.params.id;
    // let template
    console.log("snding Proposals - ");
}

exports.getClientProposals = getClientProposals;
exports.create = create;
exports.getProposal = getProposal;
exports.updateProposalStatus = updateProposalStatus;
exports.sendProposals = sendProposals;
