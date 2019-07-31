const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "Oauth2",
    user: "januardidito@gmail.com",
    clientId:
      "667767415744-4imqb7rt1v930s74vbirjeblsh80j13r.apps.googleusercontent.com",
    clientSecret: "TFxqLp8ia0wpf8vrGuLds_9X",
    refreshToken:
      "1/YcJg9BnuFyHgamza1yD3WvjCsy_Al9V2SCk1i8lX8r-zYPfGo3H_sR-fSp_qMt7D"
  }
});

const mailVerify = user => {
  var { name, username, email } = user;
  const mail = {
    from: "Benedictusdito <januardidito@gmail.com>",
    to: email,
    subject: "Hello from the other side",
    html: `<h1>Hello ${name}, its me </h1> <a href='http://localhost:2019/verify?uname=${username}' >Klik untuk verifikasi</a>`
  };

  transporter.sendMail(mail, (err, result) => {
    if (err) return console.log(err.message);

    console.log("Berhasil yaa");
  });
};

module.exports = mailVerify;
