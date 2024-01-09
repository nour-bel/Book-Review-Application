# Project Title
Book Review App

## Description
This project provides a simple API for a bookstore, allowing users to register, fetch a list of books, retrieve book details by ISBN, author, title, and get book reviews.

## Usage

## Get Book List
Endpoint: '/'
Method: GET
Returns the list of books available in the shop.

## Get Book Details by ISBN
Endpoint: '/isbn/:isbn'
Method: GET
Returns details of a book based on ISBN.

## Get Books by Author
Endpoint: '/author/:author'
Method: GET
Returns a list of books by a specific author.

## Get Books by Title
Endpoint: '/title/:title'
Method: GET
Returns a list of books with a specific title.

## Add or Modify Book Review
Endpoint: '/customer/auth/review/:isbn'
Method: PUT
Adds or modifies a review for a book. Requires user authentication.

## Delete Book Review
Endpoint: '/customer/auth/review/:isbn'
Method: DELETE
Deletes the review for a book. Requires user authentication.

## User Authentication - Login
Endpoint: '/customer/login'
Method: POST
Authenticates a user and generates an access token for further actions.

## Author
Belsaadate nour
Contact: nm.belsaadet@esi-sba.dz