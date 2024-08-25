const pool = require('../models/connection')
const bcrypt = require('bcrypt')

// Checks for a specific cookie 
const getCookie = (req, res) => {
  if (req.signedCookies.userId) {
    res.status(200).json({ userId: req.signedCookies.userId });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
}

const login = async (req, res) => {
  const { username, password } = req.body; 
  console.log('Request body:', req.body);

  try {
    const result = await pool.query(`SELECT * FROM users WHERE username = $1 AND status_user = 1`, [username]);

    if (result.rows.length > 0) {
      // Extract user data
      const user = result.rows[0];
      const hashedPassword = user.pass_user;
      const isMatch = await bcrypt.compare(password, hashedPassword); 

      if (isMatch) {
        const userId = user.iduser;

        res.cookie('userId', userId, {
          httpOnly: true,
          maxAge: 60000 * 10, // expires in 10 min
          signed: true,
          sameSite: 'Strict',
        });

        res.status(200).json({
          userId,
          loggedIn: true
        });
      } else {
        // Password incorrect
        res.status(401).json({
          message: 'Password incorrect!'
        });
      }
    } else {
      // User does not exist
      res.status(404).json({
        message: 'User does not exist'
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};


module.exports = {
  login,
  getCookie,
}
