import express from 'express';
import csrf from 'csurf';
import bodyParser from 'body-parser';
import admin from "firebase-admin";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json");
import cookieParser from 'cookie-parser';
import cors from 'cors';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();

const app = express();
const PORT = 3000;

const corsOptions = {
  origin: 'http://localhost:5173',  
  credentials: true,                 
};

app.use(cors(corsOptions));

// app.use(express.static("static"));
app.use(express.static("."));
app.use(bodyParser.json());
app.use(cookieParser());


app.post('/profile', async (req, res) => {
    const sessionCookie = req.cookies.session || '';
    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        console.log("Logged in");
        serveContentForUser('/profile', req, res, decodedClaims);
    } catch (error) {
        console.error("not working", error);
    }
});

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: "strict",
    secure: true, 
  },
});

app.get("/csrf-token", csrfProtection, (req, res) => {
  res.cookie("XSRF-TOKEN", req.csrfToken(), {
    sameSite: "strict",
    secure: true, 
  });
  res.status(200).json({ csrfToken: req.csrfToken() });
});


app.post("/sessionLogin", csrfProtection, async (req, res) => {
  const { idToken } = req.body;
  try {
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    res.cookie("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).send({ status: "success" });
  } catch (err) {
    res.status(401).send("UNAUTHORIZED REQUEST");
  }
});

app.post('/sessionLogout', (req, res) => {
    res.clearCookie('session');
    res.status(200).send('Logged out');
});

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});