const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

// Create an Express app
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());  // Use cors middleware

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// PostgreSQL connection string (use your actual connection details here)
const connectionString = 'postgresql://taha_base_user:hXUiAJk9YLD69fDqe2Lrfw9x7YyP0TdS@dpg-cv99vc2n91rc73d8kfg0-a.frankfurt-postgres.render.com/taha_base';  

// Create a PostgreSQL pool using the connection string
const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false // Required for SSL connections (e.g., for Render.com or other hosted services)
  }
});

// Define a simple POST route
app.post('/contact_form', async (req, res) => {
  const { ime, broj_telefona, email, poruka } = req.body;

  if (!ime || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO contact_form (ime, broj_telefona, email, poruka) VALUES ($1, $2, $3, $4) RETURNING *',
      [ime, broj_telefona, email, poruka]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
