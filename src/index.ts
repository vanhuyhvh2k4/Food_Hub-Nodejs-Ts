// import express from 'express';
const express = require('express');
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST", "PUT", "PATCH", "DELELTE"]
    }
});
import cors from 'cors';
import routes from './routes/index';
import firebaseConfig from './config/firebase.config';
import {initializeApp} from "firebase/app";

// const app: any = express();
const port: number = 3000;
let corsOptions: object = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

io.on('connection', (socket: any) => {
    socket.send('Hello from sever');
    
});

//initialize firebase
initializeApp(firebaseConfig);

app.use(cors(corsOptions));

// middleware
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

//initialize routes
routes(app);

//initialize port
http.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})