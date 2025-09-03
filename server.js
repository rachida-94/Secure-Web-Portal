require('dotenv').config();
require('./config/db-connection');
require('./config/Jwt-strategy'); // import jwt strategy we created
require('./config/github-strategy'); // import github strat
const express = require('express');
const passport = require('passport'); // importing passport to use as middleware
const authRouter = require('./routes/auth-router');

const app = express();
const PORT = process.env.PORT || 3000;

//////////////////
// GitHub OAuth //
//////////////////
const session = require('express-session');
app.use(
  session({
    secret: process.env.GITHUB_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.session());


app.use(passport.initialize()); // initializing passport as middleware
app.use(express.json());
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server is listening @ http://localhost:${PORT}`);
});