'use strict';
// import uniqid from 'uniqid';
const uniqid = require('uniqid');
var fs = require('fs');
const handlebars = require('handlebars');
const request = require("request");
const pdf = require('pdf-parse');
// var PDFParser = require("pdf2json");
// var PDFParser = require("pdf2json/pdfparser");

let category = ['Home','Auto'];

let savedProposals = [];
let ngrok = 'https://af11-103-127-20-132.ngrok.io';
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
    proposalData = proposalData[0];
    let current = proposalData.formRes.current;
    let recommended = proposalData.formRes.recommended;
    let formHead = Object.keys(current); //['provider','test2']
    formHead = formHead.filter(ele => ele != "note");
    let currentRes = Object.values(current);
    // currentRes.splice(-1);
    let recommendedRes = Object.values(recommended);
    recommendedRes.splice(-1);
    // let formHeadHtml = '';
    // let formcurrentHtml = '';
    // let formrecommendedHtml = '';

    // for(let i=0;i<formHead.length;i++)
    // {
    //     formHeadHtml += `${formHead[i]}`;
    // }
    // for(let i=0;i<currentRes.length;i++)
    // {
    //     formcurrentHtml += `${currentRes[i]}`;
    // }
    // for(let i=0;i<recommendedRes.length;i++)
    // {
    //     formrecommendedHtml += `${recommendedRes[i]}`;
    // }
    let note = recommended.note;
    let discount = parseInt(current['Total Cost']) - parseInt(recommended['Total Cost']);
    const templatePath = __dirname + '/templates/home/h1.html';
    const html = fs.readFileSync(templatePath, 'utf8');
    let template = handlebars.compile(html);
    const finalTemplate = template({ insuranceType: proposalData.category,acceptUrl:`${ngrok}/api/proposal/acceptedTrack/${req.params.id}`,agentEmail:"milind@insuredmine.com",formHead:formHead,currentRes:currentRes,recommendedRes:recommendedRes,note:note,discount:discount});
    console.log("finalTemplate --> ",finalTemplate);
    res.send({"data":finalTemplate});
}

function updateProposalStatus(req, res) {
    let proposalId = req.params.id;
    
    for(let k=0;k<savedProposals.length;k++)
    {
        if(savedProposals[k]._id == proposalId)
        {
            savedProposals[k]['status'] = "Accepted";
        }
    }
    console.log("proposalId --> ",proposalId," was accepted by client!!");
    res.send("Thanks for accepting!!");
    // savedProposals.map(ele => {
    //     if(ele._id == proposalId)

    // });
    //update the status of the proposal to accepted
}

function sendProposals(req,res) {
    let proposalId = req.params.id;
    let proposalData = savedProposals.filter(ele => ele._id == proposalId);
    proposalData = proposalData[0];

    let current = proposalData.formRes.current;
    let recommended = proposalData.formRes.recommended;
    let formHead = Object.keys(current); //['provider','test2']
    formHead = formHead.filter(ele => ele != "note");
    let currentRes = Object.values(current);
    // currentRes.splice(-1);
    let recommendedRes = Object.values(recommended);
    recommendedRes.splice(-1);
    let note = recommended.note;
    let discount = parseInt(current['Total Cost']) - parseInt(recommended['Total Cost']);

    const templatePath = __dirname + `/templates/home/${proposalData.template}.html`;
    const html = fs.readFileSync(templatePath, 'utf8');
    let template = handlebars.compile(html);
    const finalTemplate = template({ insuranceType: proposalData.category,acceptUrl:`${ngrok}/api/proposal/acceptedTrack/${req.params.id}`,agentEmail:"milind@insuredmine.com",formHead:formHead,currentRes:currentRes,recommendedRes:recommendedRes,note:note,discount:discount});
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

//   let dataBuffer = fs.readFileSync(__dirname + '/acord_cert_sample_filled.pdf');
 
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
        res.send(data.text);
            
    });

    // var pdfParser = new PDFParser();

    // pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
    // pdfParser.on("pdfParser_dataReady", pdfData => {
    //     fs.writeFile(__dirname + '/auto-example.json', JSON.stringify(pdfParser.getAllFieldsTypes()), ()=>{console.log("Done.");});
    // });

    // pdfParser.loadPDF(__dirname + '/acord_cert_sample_filled.pdf');

    // var pdfParser = new PDFParser();

    // pdfParser.on("pdfParser_dataError", function (errData) { console.error(errData) });
    // pdfParser.on("pdfParser_dataReady", function (pdfData) {
    // var pJSON = JSON.stringify({"formImage": pdfData.data});

    //     fs.writeFile(__dirname + '/auto-example.json', pJSON, function (err) {
    //         if(err) {
    //             console.error("parsing error: ", err);
    //         } else {
    //             console.log("parsing succeeded");
    //         }
    //     });
    // });
    // pdfParser.loadPDF(__dirname + '/acord_cert_sample_filled.pdf');
}

exports.getClientProposals = getClientProposals;
exports.create = create;
exports.getProposal = getProposal;
exports.updateProposalStatus = updateProposalStatus;
exports.sendProposals = sendProposals;
exports.extractFromPdf = extractFromPdf;