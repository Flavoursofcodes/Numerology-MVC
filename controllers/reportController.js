const express = require('express');
const reportService = require('../services/report');
const fs = require('fs')
const path = require('path')
const generate = require('../wordpdfgeneratehelper');
const mongoose = require('mongoose')
const conn = require('../db')
const mailingfunction = require('../mailingfunction')

conn.on('connected',()=>{console.log('Database connected routes/report')})

// exports.freetrial = async function(req,res,next){
//       if(req.session.user){
//     let user = req.cookies.credentials.user;
//     let pass = req.cookies.credentials.pass;

//     conn.collection('users').findOne({username : user},(err,result)=>{
//           if(!result.username){ //
//                 rs.send('Username not there');
//           }
//           if(err) console.log(err);
          
//           if(result.username === user && result.password === pass){
//                 reportService.freereport(req.query, req.cookies.credentials)
//                 //.then((resp) => res.end("Report will be sent to your email in a while"))
//                 .then((resp)=>{

//                       // console.log(path.join(__dirname,`../${resp}`)); 
//                       var filePath = path.join(__dirname,`../${resp}`);
//                       // var data = fs.readFileSync("C:/Users/Shourya/Desktop/Ellipsonic/numerology_server_new/resources/1624907826567.pdf");
//                        //console.log(data)
//                        res.contentType("application/pdf");
//                        res.sendFile(filePath);
//                 })

//                 //;res.end("Report will be sent to your email in a while"))
//           }
//           else res.send('Credentials mismatch')//If someone has changed the cookies and username:password pairs not matching, then this executes.

//     })
//       }
//       else
//       res.render('login')
// }
 
//-------------------------------------Generate PDF and send email on clicking submit-------------------------------------------------------

exports.pdfgenerator = async function(req,res){
      if(req.session.user){
    console.log(req.credentials);
    try {

      
      console.log(req.body)
     var fileName = await generate.my(req.body,req.cookies.credentials)
     var filepath=`/Users/apple/Desktop/numerology proper structure/out/${fileName}`
     await mailingfunction.sendmail(req.body.email,filepath,req.body.name).then(()=>{
       
      var data = fs.readFileSync('../out/'+ fileName );

      res.contentType("application/pdf");
      res.send(data);
     }).catch((error)=>{
       console.log(error)
        req.flash('message','Please enter a valid email address!!!!')
        res.render('error',{message:req.flash('message')})

     });
      
     
    } catch (error) {
      console.log(error);
        res.send('there was some error'+'  '+error);
    }
}
else
res.render('login')
}

//-------------------------------------Access Previous Reports of the Users on their Profile------------------------------

exports.previousReports = function(req,res){
      if(req.session.user){
    let user = req.cookies.credentials.user;
    let pass = req.cookies.credentials.pass;

   conn.collection('users').findOne({username : req.cookies.credentials.user},(err,result)=>{
          if(!result.username){ // If username is not in database.
                res.send('Username not there');
          }
          if(err) console.log(err);
          
          if(result.username === user && result.password === pass){ //Only if username and password matches, then only previous records are shown.
                conn.collection('datas').find({user : req.cookies.credentials.user}).toArray((err,resultReportHistory)=>{
                      if(err) console.log(err);
                      //console.log(result);
                      res.render('previousReports.ejs',{userData : resultReportHistory,
                                                        userName : user});
                      })
          }
          else res.send('Credentials mismatch')//If someone has changed the cookies and username:password pairs not matching, then this executes.
          
   });
}
else
res.render('login')
}