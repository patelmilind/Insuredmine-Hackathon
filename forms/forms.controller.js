'use strict';
const uniqid = require('uniqid');
var fs = require('fs');

let allForms = [];

function show (req,res) {
    res.send(allForms);
}

function create (req,res) {
    req.body['_id'] = uniqid();
    allForms.push(req.body);
    res.send(req.body);
}

function getForm (req,res) {
    let formId = req.params.id;
    console.log("form id -->",formId);
    let formJson = {};
    for(let i=0;i<allForms.length;i++)
    {
        if(allForms[i]._id == formId)
        {   
            formJson['title'] = allForms[i].title;
            let components = allForms[i].components;
            if(components && components.length > 0 )
            {
                for(let j=0;j<components.length;j++)
                {
                    let label = components[j].label;
                    let value = components[j].conditional.eq;
                    formJson[label] = value;
                }
            }
        }
    }
    res.send(formJson);
}

exports.show = show;
exports.create = create;
exports.getForm = getForm;