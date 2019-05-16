/*
 * AST Lifecare Index View Controller
 *
 * Copyright 2015 Astralink Technology
 *
 * Version 2.2.1
 * Release date - 2015-05-12
 * Released by - Fong Shi Wei
 *
 * Change Log
 * ----------
 *
 */

// // helpers
// var authorizationHelper = _require('/helpers/authorization')
// , userHelper = _require('/helpers/user');

// Authorized - Public Only (Main Page, require all user's access)
exports.index = function(req, res){
    res.render('index', {
        title: 'UP Technology'
        , viewClass: 'landing'
        , ngController: 'landingController'
    });
};



exports.home = function(req, res){
    res.render('home', {
        title: 'UP Technology'
        , viewClass: 'home'
        , ngController: 'homeController'
    });
};
