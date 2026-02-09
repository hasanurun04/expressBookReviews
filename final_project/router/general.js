const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username or password missing" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});


// Get the book list available in the shop
public_users.get('/async', async function (req, res) {
    try {
      const response = await axios.get("http://localhost:5000/");
      return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books" });
    }
  });
  


// Get book details based on ISBN
public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
      const isbn = req.params.isbn;
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
      return res.status(500).json({ message: "Error fetching book by ISBN" });
    }
  });
  

  
// Get book details based on author
public_users.get('/async/author/:author', async function (req, res) {
    try {
      const author = req.params.author;
      const response = await axios.get(`http://localhost:5000/author/${author}`);
      return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by author" });
    }
  });
  


// Get all books based on title
public_users.get('/async/title/:title', async function (req, res) {
    try {
      const title = req.params.title;
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by title" });
    }
  });
  


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});


module.exports.general = public_users;
