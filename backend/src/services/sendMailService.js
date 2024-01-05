import nodemailer from "nodemailer";
import "dotenv/config"

// Create the transporter with the required configuration for Outlook
// change the user and pass !
var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: process.env.EMAIL, // VD: 'long.hd204841@sis.hust.edu.vn'
        pass: process.env.PASSWORD //'026202006705'
    }
});

// setup e-mail data, even with unicode symbols
var mailOptions = {
    from: 'long.hd204841@sis.hust.edu.vn', // sender address (who sends)
    to: 'long.hd204841@sis.hust.edu.vn', // list of receivers (who receives)
    subject: 'Hello ', // Subject line
    text: 'Hello world ', // plaintext body
    html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
};

// send mail with defined transport object
export const sendMail = async (email, content) => transporter.sendMail({
    from: `${process.env.EMAIL}`, // sender address (who sends)
    to: email, // list of receivers (who receives)
    subject: 'Warning ', // Subject line
    text: `${content}`, // plaintext body
    html: `<b>${content} </b><br> This is the first email sent with Nodemailer in Node.js from ${process.env.EMAIL}` // html body
}, function (error, info) {
    if (error) {
        return console.log("[SEND_MESSAGE_ERROR]", error);
    }

    console.log(`[SEND_MESSAGE_SUCCESS]: to ${email} ` + info.response);
});
