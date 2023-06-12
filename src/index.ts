import express from 'express';
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
    cors: {
      origin: process.env.FRONTEND_URL!,
      methods: ["GET", "POST", "PUT", "PATCH", "DELELTE"]
    }
});
import cors from 'cors';
import routes from './routes/index';
import firebaseConfig from './config/firebase.config';
import {initializeApp} from "firebase/app";
import "dotenv/config";

// const app: any = express();
const PORT: number = parseInt(process.env.PORT!) || 3000;
let corsOptions: object = {
    origin: process.env.FRONTEND_URL!,
    optionsSuccessStatus: 200
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
http.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})