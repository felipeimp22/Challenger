import nodemailer from "nodemailer";
const send = (params) => {
  return new Promise(async (resolve, reject) => {
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "felipeimperio.dev@gmail.com",
        pass: "felipeimperio98"
      },
      tls: {
        ciphers: 'SSLv3'
      }
    })
    var mailOptions = {
      from: params.from,
      to: params.to,
      cc: params.cc,
      subject: params.subject,
      html: params.html
    }
    await transporter.sendMail(mailOptions, function (error) {
      if (error) {
        console.log(error);
        reject();
      }
      else {
        console.log("Email enviado com sucesso")
        resolve();
      }
    })
  })
}

export default send;