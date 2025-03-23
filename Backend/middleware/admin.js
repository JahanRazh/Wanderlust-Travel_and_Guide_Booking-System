const isAdmin = (req, res, next) => {
    const { role } = req.user;
    if (role === "admin") {
      next();
    } else {
      res.status(403).json({ error: true, message: "Unauthorized: Admin access required" });
    }
  };