import express from "express";
import bodyParser from 'body-parser';

import helmet from "helmet";
import cors from "cors";

const app = express();

// Call midlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

export default app
