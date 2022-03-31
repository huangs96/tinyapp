const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const cookieSession = require('cookie-session');
const helpers = require('./helpers/helpers');


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.set('trust proxy', 1);
app.use(cookieSession({
  name: 'session',
  keys: ["chicken", "remote", "candle"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

const urlDatabase = {
  "u31v0q": { longURL: "http://twitter.com", userID: "test"},
  "io2p1p": { longURL: "http://apple.ca", userID: "test"}
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  },
  
  "test": {
    id: "test", 
    email: "test@gmail.com", 
    password: bcrypt.hashSync('test', 10)
  }
};

//GET

app.get("/", (req, res) => {
  res.redirect('/urls');
});


app.get("/register", (req, res) => {
  const urlData = { urls: urlDatabase, users: users, user: "" };
  
  res.render('register', urlData);
});


app.get("/login", (req, res) => {
  
  const urlData = { users: users, urls: urlDatabase, user: "" };

  if (req.session.user_id) {
    res.redirect("/urls");
  };

  res.render("login", urlData);
});


app.get("/urls", (req, res) => {
  
  const templateVars = { urls: "", user: "", users: users };
  
  if (req.session.user_id) {
    const userID = req.session.user_id;
    
    const userObject = users[userID];
    
    const urlsForUser1 = helpers.urlsForUser(userID, urlDatabase);
    templateVars.urls = urlsForUser1;
    templateVars.user = userObject;
    
    
    res.render("urls_index", templateVars);
  } else {
    res.redirect('/login')
  }
});


app.get("/urls/new", (req, res) => {
  
  const urlData = { user: users[req.session.user_id] };
  
  if (!req.session["user_id"]) {
    return res.redirect('/login');
  }

  res.render("urls_new", urlData);
});

app.get("/urls/:shortURL", (req, res) => {
  const usercookieID = users[req.session.user_id];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  ; //req.params.shortURL grabs the key of whatever I input into the /urls/:shortURL
  const urlData = { shortURL: req.params.shortURL, longURL: longURL, user: usercookieID, userid: users[usercookieID] } //shortURL equals to req.params.shortURL (the shortURL here is replaced by whatever is put into the shortURL in line)


  res.render("urls_show", urlData);
});


app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;

  if (!urlDatabase[shortURL]) {
    return res.send('Short URL does not exist. Please Try Again.');
  }

  res.redirect(longURL);
});

//POST

app.post("/register", (req,res) => {
  const newEmail = req.body.email;
  const newPassword = bcrypt.hashSync(req.body.password, 10);
  const id = helpers.generateRandomString();

  if (newEmail === "" || newPassword === "") {
    res.send("Error Code 400. Missing one or more fields. Try Again.");
    return;
  }

  if (helpers.uniqueEmail(newEmail)) {
    res.send("Error Code 400. Email is already in use. Try Again.")
    return;
  }

  users[id] = { id: id, email: newEmail, password: newPassword };
  req.session.user_id = id;
  res.redirect('/urls')
});


app.post("/login", (req, res) => {
  
  const newEmailAddress = req.body.email;
  const newPassword = req.body.password;

  const userObject = helpers.uniqueEmail(newEmailAddress, users)

  if (userObject) {
    if (helpers.passwordMatch(newPassword, userObject)) {
      req.session.user_id = userObject.id;
      res.redirect("/urls");
      return;
    }
  }
  
  res.send("Error Code 403. Try Again.");
});


app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});


app.post("/urls/new", (req, res) => {
  const user = users[req.session.user_id];
  
  if (!user) {
    res.send("Error, please login and try again.");
    res.redirect('/login');
  }

  const uID = helpers.generateRandomString()
  urlDatabase[uID] = { longURL: req.body.longURL, userID: user.id };
});


app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const user_id = req.session["user_id"];

  if (user_id !== urlDatabase[shortURL].userID) {
    return res.send('Please Login to Delete URLS.');
  };

  delete urlDatabase[shortURL]
  return res.redirect("/urls");
});

//update edited longURL
app.post("/urls/:shortURL/update", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL].longURL = req.body.newUrl;

  return res.redirect(`/urls`);
});


app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`);
});

//generate new shortURL
app.post("/urls", (req, res) => {
  let randomURL = helpers.generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[randomURL] = { longURL:longURL, userID: req.session["user_id"] };

  res.redirect(`/urls`);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


