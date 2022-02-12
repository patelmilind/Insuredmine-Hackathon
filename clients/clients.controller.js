 'use strict';
 const uniqid = require('uniqid');
//  import uniqid from 'uniqid';
//  var agents = require('../agents.json')
 
 let allClients = [{"test data":"test value"}];

 
 // Gets a list of clients added in an agent
 function show(req, res) {
     res.json(allClients);
 }
  
 // Creates a new client
 function create(req, res) {
     console.log("req.body --> ",req.body);
     if(!('name' in req.body) || !('email' in req.body))
     {
        res.status(500).send("name and email required");
        return;
     } 

     req.body['_id'] = uniqid();
     allClients.push(req.body);
     res.send(req.body);
 }
  


 var removeByAttr = function(arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 

           arr.splice(i,1);

       }
    }
    return arr;
}

 // Deletes a client
 function destroy(req, res) {
    removeByAttr(allClients, '_id' , req.params.id);
   res.send("client successfully deleted!");
 }

//  module.exports(show, create, destroy);
exports.show = show;
exports.create = create;
exports.destroy = destroy;
 
 