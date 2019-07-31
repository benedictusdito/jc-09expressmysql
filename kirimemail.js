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

const mail = {
  from: "Benedictusdito <januardidito@gmail.com>",
  to: "pasarmarche@gmail.com",
  subject: "Hello from the other side",
  html: "<h1>Hello, its me </h1>"
};
transporter.sendMail(mail, (err, result) => {
  if (err) return console.log(err.message);

  console.log("Berhasil yaa");
});
