const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Vérifie si le nom d'utilisateur est déjà utilisé
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Vérifie les identifiants
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Connexion
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  const token = jwt.sign({ username }, "access", { expiresIn: '1h' });

  req.session.authorization = {
    accessToken: token,
    username
  };

  return res.status(200).json({ message: "Connexion réussie !", token });
});

// Ajouter ou modifier une critique
regd_users.put("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Livre non trouvé" });
  }

  if (!review) {
    return res.status(400).json({ message: "Veuillez fournir une critique" });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Critique enregistrée avec succès",
    reviews: books[isbn].reviews
  });
});

// Supprimer une critique
regd_users.delete("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Livre non trouvé" });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Critique non trouvée" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Critique supprimée avec succès" });
});

// Pour les modules externes
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
