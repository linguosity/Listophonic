const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
      return next()
    } else {
    // if they're not signed in
      res.redirect('/sessions/new')
    }
  }
  
  module.exports = isAuthenticated
  