var bCrypt = require('bcrypt-nodejs');


module.exports = function(passport, User) {
    
    //var User = require('../models/user');
    var user = User;
    var LocalStrategy = require('passport-local').Strategy;

    // serialize
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialize
    passport.deserializeUser(function(id, done) {
        user.findOne({where: {id:id} 
            }).then(function(result) {
            if (result) {
                done(null, result.get());
            } else {
                done(result.errors, null);
            }
        });
    });

    // register
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pass',
        passReqToCallback: true  // allows us to pass back the entire request to the callback
        },
        function(req, email, pass, done) {
            var generateHash = function(pass) {
                return bCrypt.hashSync(pass, bCrypt.genSaltSync(8), null);
            };

            user.findOne({
                where: {email:email}
            }).then(function(result) {
                if (result) {
                    return done(null, false, {
                        message: 'That email is already taken'
                    });
                } else {
                    var userPass = generateHash(pass);
                    var userData = {
                        email: email,
                        pass: userPass,
                        first: req.body.first,
                        last: req.body.last
                    };
                    user.create(userData).then(function(newUser, created) {
                        if (newUser) {
                            return done(null, newUser);
                        } else {
                            return done(null, false);
                        }
                    });
                }
            });
        }
    ));


    // Log In
    passport.use('local-signin', new LocalStrategy({
        
        usernameField: 'email',
        passwordField: 'pass',
        passReqToCallback: true  // allows us to pass back the entire request to the callback
        },
        
        function(req, email, password, done) {
            var isValidPassword = function(userpass, password) {
                return bCrypt.compareSync(password, userpass);
            };
        
            user.findOne({
                where:{email:email}
            }).then(function(result) {
                
                if (!result) {
                    return done(null, false, {message:'Email not found' });
                }

                if (!isValidPassword(result.pass, password)) {
                    return done(null, false, {message: 'Incorrect password' });
                }

                var userinfo = result.get();
                return done(null, userinfo);

            }).catch(function(err) {
                console.log("Error: ", err);
                return done(null, false, {message: "Something went wrong with log in" });
            });
        }
    ));

};