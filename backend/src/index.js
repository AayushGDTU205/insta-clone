import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import loginRouter from "./routes/login.js";
import followerRouter from "./routes/follower.js";
import holderRouter from "./routes/holder.js"
import { verifyJWT } from "./utils/verifyJWT.js";
import { responseHandler } from "./utils/responseHandler.js";

const app = express();
const PORT = process.env.PORT;
app.use(cors({
    credentials: true,
    origin: "https://insta-clone-k6rj.vercel.app"
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// console.log(process.env.MongoDBcon);

app.use('/', loginRouter);
app.use('/follower', verifyJWT, followerRouter);
app.use('/holder', verifyJWT, holderRouter);

mongoose.connect(process.env.MongoDBcon)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`);
        })
    })
    .catch(err => {
        console.log(err);
    })