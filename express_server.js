const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

function generateRandomString(length) {
  let shortUrl = '';
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    shortUrl += chars.charAt(Math.floor(Math.random()*chars.length))
  } return generateRandomString
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "b3xVn3": "http://www.facebook.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const urlData = { urls: urlDatabase };
  res.render("urls_index", urlData);
});

app.get("/urls/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL] //req.params.shortURL grabs the key of whatever I input into the /urls/:shortURL
  const urlData2 = { shortURL: req.params.shortURL, longURL: longURL } //shortURL equals to req.params.shortURL (the shortURL here is replaced by whatever is put into the shortURL in line)
  res.render("urls_show", urlData2);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});