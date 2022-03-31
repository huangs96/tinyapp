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

function urlsForUser (userid, urlDatabase) { 
  let uniqueDatabase = {};
  console.log("urlDatabase:", urlDatabase);
  console.log("this is userid", userid);

  for (let urlID in urlDatabase) {
    console.log("-----")
    const url = urlDatabase[urlID];
    const urlsUserId = url.userID
    console.log("lets check this URL", url);
    console.log("lets check this unique userID", urlsUserId);
    console.log("userid === url.userID", userid === url.userID);
    console.log(`${userid} === ${url.userID}`, userid === url.userID )
    if (userid === url.userID) {
      console.log("we found it");
      uniqueDatabase[urlID] = url; 
    }
  }
  return uniqueDatabase;
};


function uniqueEmail (emailAddr, users) {
  for (let userID in users) {
    if (users[userID].email === emailAddr) {
      return users[userID];
    }
  } return false;
}

function passwordMatch (pass, user) {
  const hash = user.password
 
    if(bcrypt.compareSync(pass, hash)) {
      return true;
    }
   return false;
}; 

module.exports = { 
  passwordMatch, 
  uniqueEmail, 
  generateRandomString,
  urlsForUser
  };