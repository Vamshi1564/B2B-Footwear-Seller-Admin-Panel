export default (roles = []) => {
  return (req, res, next) => {
    // TEMP: replace later with JWT
    req.user = { role: "admin" };

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
