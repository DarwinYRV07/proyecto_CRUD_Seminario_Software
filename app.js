import './loadEnv.js';
import express from 'express';
import router from './routes/routes.js';
import cookieParser from 'cookie-parser'
import sessions from 'express-session'
import {logger} from './controllers/authController.js'

const PORT = 20017
const app = express();


app.set('view engine', 'pug'); 
app.use(express.static('public'));

const oneDay = 24 * 60 * 60 * 1000
app.use(sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: oneDay }
}))

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.use(cookieParser());
app.use(logger);

app.use('/', router);
 
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})