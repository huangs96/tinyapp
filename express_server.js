const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

function generateRandomString() {
  let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randURL = "";
  let charsLength = chars.length;

  for (let i = 0; i < 6 ; i++ ) {
    randURL += chars.charAt(Math.floor(Math.random() * charsLength));
  } return randURL
};

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "" },
  "b3xVn3": { longURL: "http://www.facebook.com", userID: "" }
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
  
  "test@gmail.com": {
    id: "test@gmail.com", 
    email: "test@gmail.com", 
    password: "test"
  }
}

//GET

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const urlData = { user: user, user_id: req.cookies["user_id"]};
  if (!user) {
    res.redirect('/login/Error, please login and try again.');
  }
  res.render("urls_new", urlData);
});

app.get("/register", (req, res) => {
  const urlData = { urls: urlDatabase, user_id: req.cookies["user_id"] };;
  res.render('register', urlData);
});

app.get("/login/:error", (req, res) => {
  const user = users[req.cookies["user_id"]];
  let loginerror = '';
  
  if (req.params.error) {
     loginerror = req.params.error
  } else {
     loginerror = '';
  }
  const urlData = { user: user, urls: urlDatabase, user_id: req.cookies["user_id"], loginerror: loginerror };
  

  
  res.render("login", urlData);
});

app.get("/login/", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const loginerror = '';
  
  const urlData = { user: user, urls: urlDatabase, user_id: req.cookies["user_id"], loginerror:'' };
  
  res.render("login", urlData);
});

app.get("/urls", (req, res) => {
  const user = users[req.cookies["user_id"]] //needs to be in all header accessed pages
  const urlData = { user: user, urls: urlDatabase, user_id: req.cookies["user_id"] };
  res.render("urls_index", urlData);
});

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.cookies["user_id"]]
  const shortURL = req.params.shortURL;
  
  if (urlDatabase[shortURL] === undefined) {
    res.send('Cannot find ID. Please Try Again.');
  }

  if (urlDatabase[shortURL] === users["user_id"]) {
    res.send('Cannot find ID. Please Login');
  }

  const longURL = urlDatabase[shortURL].longURL;
  ; //req.params.shortURL grabs the key of whatever I input into the /urls/:shortURL

  const urlData2 = { user: user, shortURL: req.params.shortURL, longURL: longURL, user_id: req.cookies["user_id"] } //shortURL equals to req.params.shortURL (the shortURL here is replaced by whatever is put into the shortURL in line)
  res.render("urls_show", urlData2);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

//POST

app.post("/register", (req,res) => {
  const newEmail = req.body.email;
  const newPassword = req.body.password;
  const id = generateRandomString();
  if (newEmail === "" || newPassword === "") {
    res.send("Error Code 400. Try Again.");
    return;
  }

  if (users[newEmail]) {
    res.send("Error Code 400. Try Again.")
    return;
  }

  users[newEmail] = { id: id, email: newEmail, password: newPassword };
  res.cookie("user_id", id);
  res.redirect('/urls')
});

app.post("/login", (req, res) => {

  const newEmailAddress = req.body.email;
  const newPassword = req.body.password;
  const user = users[newEmailAddress];

  if (!user) {
    res.send("Error Code 403. Try Again.");
    return;
  } //if email address has already been taken, redirect to homepage
  
  if (newPassword === user.password) {
    res.cookie("user_id", user.id);
    res.redirect('urls');
    return;
  }
  
  res.send("Error Code 403. Try Again.");//if password matches the password in our database, redirect to urls
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]];
  console.log(user);
  if (!user) {
    res.send("Error, please login and try again.");
    res.redirect('/login');
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL]
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = req.body.id;
  res.redirect("/urls/");
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const userData = {shortURL: shortURL, longURL: urlDatabase[shortURL].longURL, user_id: req.cookies["user_id"]};
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls", (req, res) => {
  let randomURL = generateRandomString();
  const longURL = req.body.longURL;
  // let longURL = urlDatabase.randomURL.longURL;
  urlDatabase[randomURL] = { longURL:longURL, userid: "" };
  res.redirect(`/urls/${randomURL}`);         // Respond with 'Ok' (we will replace this)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//3. Redirect does not work for app.post(/urls/new)