import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import route from './routes/userRoute.js';
import adminRoute from './routes/adminRoute.js';

const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 8000;
const URL = process.env.MONGOURL;

mongoose.connect(URL).then(() => {
    console.log("connected with DB!!")
    app.listen(PORT, () => {
        console.log(`Server is running on PORT: ${PORT}`);
    })
}).catch(err => console.log(err))

app.use("/api", route);
app.use("/admin", adminRoute);