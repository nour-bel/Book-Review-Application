const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
regd_users.post("/login", (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  if (!userName || !password) {
    res.status(400).json({ error: 'Username and password are required' });
  } else {
    let user = users.find((user) => user.userName === userName && user.password === password);

    if (user) {
      req.session.authorization = {
        accessToken: jwt.sign({ data: password }, 'access', { expiresIn: "1h" }),
        userName: userName
      };
      res.json({ message: `User successfully logged in` });
    } else {
      res.status(401).json({ error: `Invalid userName or password` });
    }
  }
});



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const review = req.query.review;

  if (isNaN(isbn)) {
    res.status(400).send('Invalid ISBN');
    return;
  }

  if (!review) {
    res.status(400).json({ error: 'Review is required' });
    return;
  }

  const username = req.session.authorization.userName;

  // Update or add the review to the books database
  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    res.json({ message: `The review for the book with ISBN ${isbn} added or modified successfully ` });
  } else {
    res.status(404).send(`Book with ISBN ${isbn} not found`);
  }
});

// Inside the /auth/review/:isbn route
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);

  if (isNaN(isbn)) {
    res.status(400).send('Invalid ISBN');
    return;
  }

  const username = req.session.authorization.userName;

  // Delete the review if it exists
  if (books[isbn] && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    res.json({ message: 'Review deleted successfully' });
  } else {
    res.status(404).send(`Review for Book with ISBN ${isbn} not found`);
  }
});
  

module.exports.authenticated = regd_users;
module.exports.users = users;
module.exports.books = books;  