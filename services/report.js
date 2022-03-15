'use strict';
const nodemailer = require('nodemailer');
const process = require('process'),
    mysql = require('mysql'),
    puppeteer = require('puppeteer');

const grid = require('gridfs-stream') 
const fs = require('fs')
const path = require('path') 

// db = require('../_helpers/db'),
// User = db.User;

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ellipsonic@123',
    database: 'numerology',
    insecureAuth: true
});

const mongoose = require('mongoose');
const { resolve } = require('path');
const { fstat } = require('fs');
var gfs;

//var url = "mongodb://localhost:27017/numero"
var url = "srv://shourya123:shourya123@ellipcluster.ar2u2.mongodb.net/numero?retryWrites=true&w=majority"
// mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
var db = mongoose.connection;

db.on("error", console.log.bind(console, "connection error"));
db.once("open", () => {
    console.log("connection success.");
    gfs = grid(db.db,mongoose.mongo);
    gfs.collection('files')
});



var Schema = mongoose.Schema;
var userSchema = new Schema({
    name : String,
    lname : String,
    email : String,
    dob : String,
    tob : String,
    gender : String,
    country : String,
    twinsOrTriplets : String,
    fatherDOB : String,
    motherDOB : String,
    user : String,
    generatedAt : String,
    pdfName : String
});

// var User = mongoose.model("data", userSchema); //mongoose creates collection with an 's' so collection name will will be datas

module.exports = {
    freereport
};

async function freereport(req, credentials) {

    console.log(req);

    try {

        let email = req.email,
            name = req.name + ' ' + req.lname,
            dob = req.dob,
            tob = req.timeofbirth,
            gender = req.gender,
            twinsOrTriplets = req.twinsOrTriplets,
            fdob = req.fdob,
            mdob = req.mdob,
            country = req.country;
            
            var date = Date();
            var dateNow = Date.now();    
            

        if(req.fdob){
            fdob = req.fdob;
        }else fdob = ''

        if(req.mdob){
            mdob = req.mdob;
        }else mdob = ''
        
       // var pdfName = path.join(__dirname,`../resources/${dateNow}.pdf`)

        let newUser = new User({
            name : req.name,
            lname : req.lname,
            email : req.email,
            dob : req.dob,
            tob : req.timeofbirth,
            gender : req.gender,
            country : req.country,
            twinsOrTriplets : req.twinsOrTriplets,
            fatherDOB : fdob,
            motherDOB : mdob,
            user : credentials.user,
            generatedAt : date,
            pdfName : dateNow+'.pdf'
        });

        newUser.save((err)=>{
            if(err) console.log(err);
            
            console.log("User data saved"+credentials.user);
            db.collection('users').findOneAndUpdate({username:credentials.user, password:credentials.pass},{$inc: { filesGenerated: 1 }})
            
        })

        //let dataId = newUser._id; //object id of record just saved
        
        // let user = await User.findById(id).select('-hash'),
        //     email = user.username,
        //     name = user.firstName + " " + user.lastName,
        //     dob = new Date(user.dob).toLocaleDateString().split('/').join('-'),
        
            let browser = await puppeteer.launch({
                // defaultViewport: null,
                headless: true,
                args: ['--no-sandbox']
            }),
            page = await browser.newPage();
        // console.log(username);
         await page.goto("http://localhost:3000/html?name=" + name + "&dob=" + dob + "&tob=" + tob + "&gender=" + gender + "&twinsOrTriplets=" + twinsOrTriplets + "&fdob=" + fdob + "&mdob=" + mdob + "&country=" + country, { waitUntil: 'networkidle2' });
        //await page.goto("http://www.google.com", { waitUntil: 'networkidle2' });

        var pdfFileName = "resources/" + dateNow + '.pdf';
        await page.pdf({
            printBackground: true,
            format: 'A5',
            path: pdfFileName,
            PreferCSSPageSize: true
        });
        await browser.close();
        console.log('done---------------------------------------------------------------------------------------------------------');
        // let transporter = nodemailer.createTransport({
        //     host: 'mail.ellipsonic.a2hosted.com',
        //     port: 465,
        //     secure: true, // true for 465, false for other ports
        //     rejectUnauthorized: false,
        //     auth: {
        //         user: "varun@ellipsonic.a2hosted.com", // generated ethereal user
        //         pass: "Varun@123" // generated ethereal password
        //     }
        // });

        // send mail with defined transport object
        // var attachments = [{ filename: 'Report.pdf', path: process.env.PWD + '/' + pdfFileName, contentType: 'application/pdf' }];
        // let info = await transporter.sendMail({
        //     from: '"NumerologyTeam" <cs-apps@ucmhpacademy.com>', // sender address
        //     to: email,
        //     subject: name + ' - Numerology Report ', // Subject line
        //     html: '<div><img style="width:60%;" src="https://krthkbharadwaj.github.io/numbergame/images/logo.png"/>' +
        //         '<p>Hello ' + name + '</p><br>' +
        //         '<p>Please find attached the numerology report as we have received a request to generate the same.</p>' +
        //         '<br><p>Team UCMHP</p></div>',
        //     attachments: attachments
        // });

        // const user = { name: name, dob: dob, email: email, country: country };
        //     con.query('INSERT INTO users SET ?', user, (err, res) => {
        //     if(err) { 
        //         console.log(err);
        //     }

        //     console.log('User DB insert success. '+email);
        // });

        // console.log('Free report sent to ' + email + ': %s', info.messageId);

        // let writeStream = gfs.createWriteStream({filename : dateNow+'.pdf',
        //                                          metadata : {recordForDataId : dataId}
        //             });

        // console.log("__dirname : "+__dirname);

        // fs.createReadStream(path.join(__dirname,`../resources/${dateNow}.pdf`)).pipe(writeStream)             


        return pdfFileName
    } catch (err) {
        console.log(err);

    }
}
