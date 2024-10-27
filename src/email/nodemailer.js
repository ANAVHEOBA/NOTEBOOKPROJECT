const nodemailer = require("nodemailer");

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "readysocial.help@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

const nodemailerWelcomeMail = async (name, email, actionLink) => {
  let mailDetails = {
    from: "readysocial.help@gmail.com",
    to: email,
    subject: "Ready Social confirmation mail",
    text: `Hello ${name},
    
        Follow this link to verify your email address.
        
        ${actionLink}
        
        If you didn’t ask to verify this address, you can ignore this email.
        
        Thanks,
        
        Ready Team`,
  };
  try {
    const data = await mailTransporter.sendMail(mailDetails);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// password reset
const nodeMailerPasswordResetMail = (email, actionLink) => {
  let mailDetails = {
    from: "readysocial.help@gmail.com",
    to: email,
    subject: "Reset your password for Ready Social",
    text: `Hello,

        Follow this link to reset your ready password for your email account.
        
        ${actionLink}        
        If you didn’t ask to reset your password, you can ignore this email.
        
        Thanks,
        
        Ready team`,
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      return err;
    } else {
      return { message: "Email sent successfully" };
    }
  });
};

module.exports = { nodemailerWelcomeMail, nodeMailerPasswordResetMail };
