'use strict';
// import uniqid from 'uniqid';
const uniqid = require('uniqid');
const fs = require('fs');
const handlebars = require('handlebars');
const request = require("request");
const pdf = require('pdf-parse');

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
    res.send({"data":finalTemplate});
}

function updateProposalStatus(req, res) {
    let proposalId = req.params.id;
    console.log("proposalId --> ",proposalId," was accepted by client!!");
    //update the status of the proposal to accepted
}

function sendProposals(req,res) {
    let proposalId = req.params.id;
    let proposalData = savedProposals.filter(ele => ele._id == proposalId);
    proposalData = proposalData[0];

    const templatePath = __dirname + `/templates/home/${proposalData.template}.html`;
    const html = fs.readFileSync(templatePath, 'utf8');
    let template = handlebars.compile(html);
    const finalTemplate = template({ insuranceType: proposalData.category,acceptUrl:`${ngrok}/api/proposal/acceptedTrack/${req.params.id}` });
    console.log("finalTemplate --> ",finalTemplate);
    // let template
    let endPoint = 'https://api.nylas.com/send';
    let nylas_token = "6OvmqyeqNQwRv2HvuPvXiOXaMVWzIQ"; //milind@insuredmine.com nylas token
    let body = {"to":[{"email":`${proposalData.clientEmail}`,"name":`${proposalData.clientName}`}],"cc":[],"bcc":[],"body":`${finalTemplate}`,"subject":"Proposal for","file_ids":[],"tracking":{"links":true,"opens":true,"thread_replies":false,"payload":"Any string you want!!"}};

    let options = {
        method: 'POST',
        url: endPoint,
        headers: { authorization: nylas_token },
        body: body,
        json: true
    };
    console.log("snding Proposals - ");
    request(options, async function (error, response, body) {
        if (error) {
            // callback({ "message": "Something went wrong, Please re-connect your account from setting!" }, null);
            res.status(503).send({"message":"null","error":error});

        } else if (response.statusCode != 200) {
            console.log("Some error occured in sending email- from nylas " + JSON.stringify(response));
            res.status(503).send({"message":"Something went wrong, Please re-connect your account from setting!"});
            // callback({ "message": "Something went wrong in sending email, Please try after some time or contact support" }, null);
            //res.status(503).send({"message":"Something went wrong, Please re-connect your account from setting!"});
        }
        else {
            res.send(JSON.stringify(body));
        }
        
    });
}

function extractFromPdf(req,res) {

  let dataBuffer = fs.readFileSync(__dirname + '/auto-example.pdf');
 
    pdf(dataBuffer).then(function(data) {
    
        // number of pages
        console.log("number of pages --> ",data.numpages);
        // number of rendered pages
        console.log("rendered pages --> ",data.numrender);
        // PDF info
        console.log(" PDF info --> ",data.info);
        // PDF metadata
        console.log("PDF metadata -->", data.metadata); 
        // PDF.js version
        // check https://mozilla.github.io/pdf.js/getting_started/
        // console.log(data.version);
        // PDF text
        console.log("PDF text --> ",data.text); 
            
    });
}

exports.getClientProposals = getClientProposals;
exports.create = create;
exports.getProposal = getProposal;
exports.updateProposalStatus = updateProposalStatus;
exports.sendProposals = sendProposals;
exports.extractFromPdf = extractFromPdf;