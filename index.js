const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors');
dotenv.config();

const emailRouter = require('./routes/email')


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/email', emailRouter);



app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running");
})
