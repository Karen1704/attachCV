const emailRouter = require('express').Router();
const multer = require('multer');
const path = require('path');
const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const upload = multer(); // Configure destination for temporary files

emailRouter.post('/sendCV', upload.single('attachment'), async (req, res) => {
  try {
      const { firstName, lastName, phone, email, message } = req.body;
      const attachmentPath = req.file.path; // Path to uploaded file
    //   const attachmentName = req.file.originalname; // Original filename
      const decodedAttachmentName = decodeURIComponent(req.file.originalname);
      // Email data
      const msg = {
          to: "avetyanvaleri@gmail.com",
          from: process.env.SENDER_EMAIL, 
          subject: `${firstName} ${lastName} CV`,
          html:`<p><strong>First Name:</strong>${firstName}</p> <p><strong>Last Name:</strong>${lastName}</p>  <p><strong>Email:</strong>${email}</p> <p><strong>Phone:</strong>${phone}</p>   <p><strong>Message:</strong>${message}</p>`,
          attachments: [
              {
                  filename: decodedAttachmentName, 
                  content: req.file.buffer.toString('base64'),
                  type: 'application/pdf', 
                  disposition: 'attachment'
              }
          ]
      };

      await sgMail.send(msg);

   

      res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Error sending email' });
  }
});

emailRouter.post('/contactForm', upload.single('attachment'), async (req, res) => {
    try {
        const { firstName, lastName, phone, email, message } = req.body;
        // Email data
        const msg = {
            to: "avetyanvaleri@gmail.com",
            from: process.env.SENDER_EMAIL, 
            subject: `${firstName} ${lastName}`,
            html:`<p><strong>First Name:</strong>${firstName}</p> <p><strong>Last Name:</strong>${lastName}</p>  <p><strong>Email:</strong>${email}</p> <p><strong>Phone:</strong>${phone}</p>   <p><strong>Message:</strong>${message}</p>`,
        };
  
        await sgMail.send(msg);
  
     
  
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error sending email' });
    }
  });


module.exports = emailRouter;
