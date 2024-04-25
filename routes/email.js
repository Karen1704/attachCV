const emailRouter = require('express').Router();
const fs = require("fs")
const multer = require('multer');
const path = require('path');
const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const upload = multer({ dest: 'uploads/' }); // Configure destination for temporary files

emailRouter.post('/sendCV', upload.single('attachment'), async (req, res) => {
  try {
      const { firstName, lastName, phone, email, message } = req.body;
      const attachmentPath = req.file.path; // Path to uploaded file
      const attachmentName = req.file.originalname; // Original filename

      // Email data
      const msg = {
          to: email,
          from: 'karen.ghalachyan1@edu.ysu.am', // Update with your email address
          subject: `${firstName} ${lastName} CV`,
          html:`<p><strong>Name:</strong>${firstName}</p> <p><strong>SurName:</strong>${lastName}</p>  <p><strong>Email:</strong>${email}</p> <p><strong>Phone:</strong>${phone}</p>   <p><strong>Message:</strong>${message}</p>`,
          attachments: [
              {
                  filename: attachmentName, // Use original filename
                  content: fs.readFileSync(attachmentPath, { encoding: 'base64' }),
                  type: 'application/pdf', // Update with correct MIME type if needed
                  disposition: 'attachment'
              }
          ]
      };

      // Send email using SendGrid
      await sgMail.send(msg);

      // Delete uploaded file after sending email
      fs.unlink(attachmentPath, (err) => {
          if (err) {
              console.error('Error deleting file:', err);
          } else {
              console.log('File deleted successfully');
          }
      });

      res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Error sending email' });
  }
});


module.exports = emailRouter;
