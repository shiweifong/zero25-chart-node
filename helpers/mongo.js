/*
 * AST Mongo DB Helper
 *
 * Copyright 2015 Astralink Technology
 *
 * Version 2.2
 * Release date - 2016-08-24
 * Released by - Fong Shi Wei
 *
 * Change Log
 * ----------
 * Connection String
 *
 */

exports.formatConnString = function(dbConfig){
    if (
        dbConfig &&
        _.isObject(dbConfig) &&
        dbConfig.dbUser &&
        dbConfig.password &&
        dbConfig.host &&
        dbConfig.db
    ){
        var connString = 'mongodb://' + dbConfig.dbUser + ':' + dbConfig.password +'@' + dbConfig.host + '/' + dbConfig.db + '?';

        var connParms = {};
        if (dbConfig.secured) connParms.ssl = dbConfig.secured;
        if (dbConfig.replicaSet) connParms.replicaSet = dbConfig.replicaSet;
        if (dbConfig.authSource) connParms.authSource = dbConfig.authSource;

        connParms = qs.stringify(connParms);
        connString += connParms;

        return connString;
    }else{
        return null;
    }
}