require('dotenv').config();
import express from "express";
import config from 'config';
import connectDB from "./utils/connectDB";
import router from "./routes";
import deserializeUser from "./middleware/deserializeUser";
const PORT = process.env.PORT || config.get('PORT');

const app = express();

app.use(express.json());

connectDB();

app.use(deserializeUser);

app.use(router);

app.listen(PORT, () => console.log(`Server up at http://localhost:${PORT}`))
