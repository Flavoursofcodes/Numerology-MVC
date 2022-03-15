





const nodemailer = require("nodemailer");




const smtpEndpoint = "email-smtp.ap-southeast-1.amazonaws.com";
const port = 587;
const senderAddress = " 'UCMHP' <cs-apps@ucmhpacademy.com>";
// var toAddresses = ;

// var bccAddresses = "cs-apps@ucmhpacademy.com";



// (Optional) the name of a configuration set to use for this message.
// var configurationSet = "ConfigSet";


var subject = "Your 'Archetype Compass' Report is ready.";





exports.sendmail= async function(mailid,filepath,name){

  // Create the SMTP transport.
  let transporter = nodemailer.createTransport({
    host:smtpEndpoint,
    port: port,
    secure: false, // true for 465, false for other ports
    auth: {
      user:  "AKIA5LSKBGAHL4S6HUMV",
      pass: "BBSR4hJg0yYmy2l3uWYLVuaaoz8kFccl/h0E5ttWtoBS"
    }
    
  });


  let mailOptions = {
    from: senderAddress,
    to: `${mailid}`,
    subject: subject,
    // cc: ccAddresses,
    // bcc: bccAddresses,
    text: `Dear ${name},

    Good day to you.
    
    Thank you for purchasing our Archetype Compass. Your support and trust are very much appreciated. 
    Attached is the summary report of yourself. 
    
    Enjoy reading the summary of who you really are, your inborn strengths, weaknesses, and some of the ideal careers you are suitable for. 
    
    Please follow our telegram Channel https://t.me/ucmhpacademy to get our updates. 
    
    Wishing you a wonderful day ahead!
    
    UCMHP Processing Team
    UCMHP Academy Pte Ltd 
    Web www.ucmhpacademy.com, Facebook www.facebook.com/UCMHP`,
    // html: body_html,
    // Custom headers for configuration set and message tags.
    // headers: {
    //   'X-SES-CONFIGURATION-SET': configurationSet,
    //   'X-SES-MESSAGE-TAGS': tag0,
    //   'X-SES-MESSAGE-TAGS': tag1
    // }
    attachments:[

        {path:filepath}
            
        ]
  };

  // Send the email.
  let info = await transporter.sendMail(mailOptions)

  console.log("Message sent! Message ID: ", info.messageId);

 
}

