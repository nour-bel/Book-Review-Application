const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  if(!userName || !password){
    res.status(400).json({ error: 'Username and password are required.' });
  }
  else {
    let user= users.find((user)=> {
     return user.userName === userName && user.password === password
    })
    if (user && user.length>0){
      res.send(`UserName already exist please choose another username.`)
    }
    else{
      const newuser= {userName, password}
      users.push(newuser)
      res.status(201).json({ message: 'User registered successfully.'});
    }
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.status(200).send(JSON.stringify( books,null,3));
});

public_users.get('/books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.status(200).send(JSON.stringify(response.data, null, 3));
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn);

  // Check if the parsed ISBN is a valid number
  if (isNaN(isbn)) {
    res.status(400).send('Invalid ISBN');
    return;
  }

  const book = books[isbn];
  if (book) {
    res.status(200).send(JSON.stringify(book, null, 3));
  } else {
    res.status(404).send(`Book with ISBN ${isbn} not found`);
  }
 });
  

 public_users.get('/book/:isbn', function (req, res) {
  const isbn = parseInt(req.params.isbn);

  if (isNaN(isbn)) {
    res.status(400).send('Invalid ISBN');
    return;
  }

  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      res.status(200).send(JSON.stringify(response.data, null, 3));
    })
    .catch(error => {
      res.status(404).send(`Book with ISBN ${isbn} not found`);
    });
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  if (author){
      let book = Object.values(books).filter((book) =>{
        return book.author === author
        });
      res.send(`books by author ${author}` + JSON.stringify(book , null , 3));
  }
  else{
    res.send(`specfie the author name please`)
  }
});

public_users.get('/book/author/:author', async function(req,res){
  const author= req.params.author;
  try{
  const response= await axios.get(`http://localhost:5000/author/${author}`);
  res.status(200).send(JSON.stringify(response.data,null,3));
  }
  catch(error){
    res.status(404).send(`Book with this author name ${author} not found`)
  }
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  if (title){
  let book = Object.values(books).filter((book)=>{ 
    return book.title === title;
   });
    if (book.length>0){
      res.send(`books with title ${title} : `+ JSON.stringify(book , null , 3))
    }
    else{
      res.send(`there is no book with this title `)
    }
  }
  else {
    res.send(`please specifie the book title`);
  }

});

public_users.get('/book/title/:title', async function(req,res){
  const title=req.params.title;
  try{
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      res.status(200).send(JSON.stringify(response.data , null , 3));
  }
  
  catch(error){
    res.status(404).send(`Book with this title ${title} not found`)
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
const isbn = parseInt( req.params.isbn );
 let book =books[isbn]
 res.send(JSON.stringify(book.reviews));
 })

module.exports.general = public_users;
