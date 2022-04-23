require('dotenv').config();
import express from "express";
import config from 'config';
import connectDB from "./utils/connectDB";
import router from "./routes";
const PORT = process.env.PORT || config.get('PORT');

const app = express();

connectDB();

app.use(router);

app.listen(PORT, () => console.log(`Server up at http://localhost:${PORT}`))
