import nodemailer from "nodemailer";
import "dotenv/config"

// Create the transporter with the required configuration for Outlook
// change the user and pass !
/*
var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: process.env.EMAIL, // VD: 'He.Thong.Giam.Sat.Muc.Nuoc@gmail.com'
        pass: process.env.PASSWORD //'123456$z'
    }
});
*/

// Nếu sender dùng gmail thường không phải Outlook:
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Sử dụng SSL
    auth: {
      user: process.env.EMAIL, // Địa chỉ email của bạn
      pass: process.env.PASSWORD // Mật khẩu email của bạn
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
    text: content, // plaintext body
    html: `<b>${content} </b><br> This is the first email sent with Nodemailer in Node.js from ${process.env.EMAIL}` // html body
}, function (error, info) {
    if (error) {
        return console.log("[SEND_MESSAGE_ERROR]", error);
    }

    console.log(`[SEND_MESSAGE_SUCCESS]: to ${email} ` + info.response);
});


export const sendMail1 = async (req, res) => {
    const { email, content } = req.body;
  
    transporter.sendMail(
      {
        from: `${process.env.EMAIL}`, // sender address (who sends)
        to: email, // list of receivers (who receives)
        subject: 'Hello!', // Subject line
        text: content, // plaintext body
        html: `<b>${content} </b><br> Bạn đã đăng ký tài khoản thành công vào hệ thống theo dõi mực nước của chúng tôi.<br> Email liên hệ: ${process.env.EMAIL}` // html body
      },
      function (error, info) {
        if (error) {
          console.log("[SEND_MESSAGE_ERROR]", error);
          return res.status(500).json({ error: 'Error sending email' });
        }
  
        console.log(`[SEND_MESSAGE_SUCCESS]: to ${email} ` + info.response);
        return res.status(200).json({ success: true });
      }
    );
  };