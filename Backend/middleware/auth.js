const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: true, 
        message: "Authentication required. No token provided." 
      });
    }
    
    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: true, 
        message: "Authentication required. Invalid token format." 
      });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        // Identify specific token errors
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ 
            error: true, 
            message: "Authentication token expired. Please login again." 
          });
        }
        
        return res.status(401).json({ 
          error: true, 
          message: "Authentication failed. Invalid token." 
        });
      }
      
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res.status(500).json({ 
      error: true, 
      message: "Internal server error during authentication" 
    });
  }
};

module.exports = { authenticateToken };