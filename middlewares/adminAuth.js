const adminAuth = (req, res, next) => {
  const { user } = req.session;
  if (user) {
    next();
  } else {
    res.redirect("/login");
  }
};

export default adminAuth;
