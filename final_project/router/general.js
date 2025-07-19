const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis" });
    }
  
    if (isValid(username)) {
      return res.status(409).json({ message: "Utilisateur déjà existant" });
    }
  
    users.push({ username, password });
  
    return res.status(200).json({ message: "Utilisateur enregistré avec succès" });
  });
  
// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const filteredBooks = Object.values(books).filter(
      book => book.author.toLowerCase() === author.toLowerCase()
    );
    return res.status(200).json(filteredBooks);
  });
  
  
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const filteredBooks = Object.values(books).filter(
      book => book.title.toLowerCase() === title.toLowerCase()
    );
    return res.status(200).json(filteredBooks);
  });
  
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
  });
  module.exports.general = public_users;


  public_users.get('/', async (req, res) => {
  try {
    const booksList = await new Promise((resolve, reject) => {
      resolve(books);
    });
    return res.status(200).json(booksList);
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la récupération des livres." });
  }
});


public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const book = await new Promise((resolve, reject) => {
      resolve(books[isbn]);
    });

    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Livre introuvable" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Erreur interne" });
  }
});



public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
    const result = await new Promise((resolve, reject) => {
      const booksByAuthor = Object.values(books).filter(book => book.author === author);
      resolve(booksByAuthor);
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la récupération des livres par auteur." });
  }
});




public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
    const result = await new Promise((resolve, reject) => {
      const booksByTitle = Object.values(books).filter(book => book.title === title);
      resolve(booksByTitle);
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la récupération des livres par titre." });
  }
});

