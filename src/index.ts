import express from 'express';
import cors from 'cors';
import routes from './routes/index';
import firebaseConfig from './config/firebase.config';
import {initializeApp} from "firebase/app";

const app: any = express();
const port: number = 3000;

let corsOptions: object = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

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
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})