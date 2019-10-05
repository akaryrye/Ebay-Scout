module.exports = function(app, passport) {
    
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect("/login");
    }

    app.get("/register", function(req, res) {
        res.render("register");
    });

    app.get("/login", function(req, res) {
        res.render("login");
    });

    app.get("/dashboard", isLoggedIn, function(req, res) {
        res.render("dashboard", {user : req.user});
    });

    app.get("/logout", function(req, res) {
        req.session.destroy(function(err) {
            res.redirect("/");
        });
    });

    app.post('/register', passport.authenticate('local-signup', 
        {successRedirect: '/dashboard', failureRedirect: '/register' }
    ));

    app.post("/login", passport.authenticate('local-signin', 
        {successRedirect: '/dashboard', failureRedirect: '/login' }
    )); 
    
};


