const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session & Flash
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// Azure Database connection
const db = mysql.createConnection({
  host: 'c237-all.mysql.database.azure.com',
  user: 'c237admin',
  password: 'c2372025!',
  database: 'C237_022_24041079', // Replace with your actual admin ID, e.g. C237_022_23012345
  port: 3306,
  ssl: {
    rejectUnauthorized: true
  }
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    return;
  }
  console.log('Connected to Azure MySQL database');
});

// Homepage
app.get('/', (req, res) => {
  res.render('home');
});

// Show Register Page
app.get('/register', (req, res) => {
  res.render('register', { message: req.flash('error') });
});

// Handle Registration
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (results.length > 0) {
      req.flash('error', 'Email already registered.');
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      (err, result) => {
        if (err) throw err;
        res.redirect('/login');
      }
    );
  });
});

// Show Login Page
app.get('/login', (req, res) => {
  res.render('login', { message: req.flash('error') });
});

// Handle Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (results.length === 0) {
      req.flash('error', 'Email not found.');
      return res.redirect('/login');
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      req.session.user = user;
      res.redirect('/dashboard');
    } else {
      req.flash('error', 'Incorrect password.');
      res.redirect('/login');
    }
  });
});

// Dashboard (Protected Page)
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.send(`Welcome, ${req.session.user.username}! Browse and manage your car rentals here.`);
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
