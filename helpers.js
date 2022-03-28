const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

function generateRandomString() {
  let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randURL = "";
  let charsLength = chars.length;

  for (let i = 0; i < 6 ; i++ ) {
    randURL += chars.charAt(Math.floor(Math.random() * charsLength));
  } return randURL
};

function urlsForUser (id, urlDatabase) { //urlsForUser matches the unique urls of each user (cookie) so that they are printed in URL path.
  let uniqueDatabase = {};

  for (let uID in urlDatabase) {
    // console.log("looping:", uID);
    // console.log("urlDatabase:", urlDatabase[uID].userID);
    console.log("urlDatabase:", urlDatabase);
    
    if (urlDatabase[uID].userID === id) {
      uniqueDatabase[uID] = urlDatabase[uID]; //pushes shortURL and LongURL into the new database
    }
  }
  return uniqueDatabase;
}


function uniqueEmail (emailAddr, users) {
  for (let user in users) {
    if (users[user].email === emailAddr) {
      return users[user]
    }
  } return false;
}

function passwordMatch (pass, user) {
  console.log("passwordmatch user:", user);
  const hash = user.password

  for (id in users) {
    if(bcrypt.compareSync(pass, hash)) {
      return true;
    }
  } return false;
}; //Everything should be functionable before then -- passwordMatch currently only compares hashed password with input password, which would never match. Can use registered account (new) to test.

module.exports = { 
  passwordMatch, 
  uniqueEmail, 
  generateRandomString,
  urlsForUser
  };