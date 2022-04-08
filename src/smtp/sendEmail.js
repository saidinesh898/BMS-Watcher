// const MailazyClient = require('mailazy-node');
// const client = new MailazyClient({ accessKey: process.env.accessKey_MAIL, accessSecret: process.env.accessSecret_MAIL });
const  nodemailer = require('nodemailer');
require('../db/mongoose')
const EmailList = require('../models/emailList')

// const sendEmail = async (sendPlayload='') => {
//     sendPlayloadString = sendPlayload.toString()
//     try {
//         const resp = await client.send({
//             to: 'saidinesh898@gmail.com', // required
//             from: 'no-reply@sinuos.in', // Use domain you verified, required
//             subject: 'New Cinema Added ', // required
//             text: sendPlayloadString,
//             html: '',
//         });
//         console.log("resp: " + resp);
//     } catch (e) {
//         console.log("errror: " + e);
//     }
// }


// sendEmail()
const sendEmail = async (sendPlayload='') => {

  const emailDump = await EmailList.find()
  const email = await emailDump[0].emailAddress
  let emaillist = email.split(",")
  console.log(emaillist)

    sendPlayloadString = JSON.stringify(sendPlayload)
    let transporter = nodemailer.createTransport({
        host: process.env.host,
        port: process.env.mailport,
        secure: 'STARTTLS', // upgrade later with STARTTLS
        auth: {
        user: process.env.user,
        pass: process.env.pass,
        },
    });

  
    transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages");
        }
      });
      let mailOptions = {
        from: 'no-reply@sinuos.in',
        to: emaillist,
        subject: 'Ticket Watcher - Node.JS',
        text: `
        Movie Name : ${sendPlayload.movie} 
        TicketURL : ${sendPlayload.TicketURL}
        Theater Name : ${sendPlayload.newTheater}
        `
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = sendEmail