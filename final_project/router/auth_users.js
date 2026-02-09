const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

/* -------- helpers -------- */

const isValid = (username) => {
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  return users.some(
    user => user.username === username && user.password === password
  );
}

/* -------- TASK 7: LOGIN -------- */

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      { username },
      "access",
      { expiresIn: "1h" }
    );

    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).json({ message: "User successfully logged in" });
  }

  return res.status(401).json({ message: "Invalid Login. Check username and password" });
});


/* -------- TASK 8: ADD / MODIFY REVIEW -------- */

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // reviews zaten OBJECT, parse ETMİYORUZ
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Aynı kullanıcıysa overwrite, farklıysa ekleme
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully"
  });
});


/* -------- TASK 9: DELETE REVIEW -------- */

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
  
    // Session’dan username al
    const username = req.session.authorization.username;
  
    // Kitap var mı?
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Kullanıcının review’u var mı?
    if (books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found for this user" });
    }
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
