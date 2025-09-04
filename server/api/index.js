import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import route from '../routes/userRoute.js';
import adminRoute from '../routes/adminRoute.js';

const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 8000;
const URL = process.env.MONGOURL;

// Root route for testing
app.get('/', (req, res) => {
    res.json({ 
        message: 'Custom Fat Loss India API is running!',
        status: 'success',
        timestamp: new Date().toISOString(),
        endpoints: {
            root: '/',
            api: '/api',
            admin: '/admin'
        }
    });
});


mongoose.connect(URL).then(() => {
    console.log("connected with DB!!")
    app.listen(PORT, () => {
        console.log(`Server is running on PORT: ${PORT}`);
        console.log(`Test the API at: http://localhost:${PORT}`);
    })
}).catch(err => console.log(err))

app.use("/api", route);
app.use("/admin", adminRoute);