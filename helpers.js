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

function urlsForUser (id, urlDatabase) { 
  let uniqueDatabase = {};

  for (let uID in urlDatabase) {
    
    console.log("urlDatabase:", urlDatabase);
    
    if (urlDatabase[uID].userID === id) {
      uniqueDatabase[uID] = urlDatabase[uID]; 
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
}; 

module.exports = { 
  passwordMatch, 
  uniqueEmail, 
  generateRandomString,
  urlsForUser
  };