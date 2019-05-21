/**
 * GLOBAL MODULES
 */

// set the environment
process.env.NODE_ENV = 'production';
appName = 'zero25';
reg = 'sg';

_require = function(name) {
    return require(__dirname + name);
};

__root = __dirname;
_ = require('underscore');
fs = require('fs');
lodash = require('lodash');
config = require('./config');
async = require('async');
moment = require('moment-timezone');
request = require('request');
slug = require('slug');
queryString = require('query-string');
mongoose = require('mongoose');
qs = require('qs');
mongoose.Promise = require('bluebird');
time = require('time');
express = require('express');
http = require('http');
path = require('path');
methodOverride = require('method-override');
cookieParser = require('cookie-parser');
bodyParser = require('body-parser');
favicon = require('serve-favicon');
morgan = require('morgan');
session = require('express-session');
expressLayouts = require('express-ejs-layouts');
MongoStore = require('connect-mongo')(session);
multer = require('multer');
multipart = require('connect-multiparty');

/**
 * APP PRE-CONFIGURATION
 */

time.tzset('UTC');

var environment = process.env.NODE_ENV
    , app = express()
    , cookieMaxAge = 30 * 24 * 60 * 60 * 1000  // 30 days
    , cookieSecure = false

/**
 * GLOBAL VARIABLES
 */


/**
 * CUSTOM MODULES
 */
var routes = require('./routes'),
    mzero25 = require('./routes/m-zero25'),
    mcore = require('./routes/m-core'),
    mongoHelper = _require('/helpers/mongo');

/**
 * MODELS, CONTROLLERS, HELPERS
 */

appModels = _require('/app-models');
appHelpers = _require('/app-helpers');
appControllers = _require('/app-controllers');

/**
 * REDIS CACHE AND MONGODB CONNECTION
 */


mainConn = mongoHelper.formatConnString(config.mongo);
mongodb = mongoose.connect(mainConn, { useNewUrlParser: true });


/**
 * APP INIT CONFIGURATIONS
 */
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(morgan('common'));
app.use(bodyParser.urlencoded({extended: true,limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(methodOverride());
app.use(cookieParser());
app.set('trust proxy', 1); //trust first proxy
app.use(session({
    secret: 'sh1w31p@ssw0rd',
    name : 'lifecare-session',
    resave : false,
    saveUninitialized : false,
    unset : 'destroy',
    cookie: {
        maxAge: cookieMaxAge,
        secure: cookieSecure
    },
    store: new MongoStore({
        url: mainConn,
        clear_interval: 3600 //clear expired session every hour
    })
}));
app.use(favicon(__dirname + '/public/img/favicon.ico', { maxAge: cookieMaxAge }));
app.use(express.static(path.join(__dirname, 'public')));


/**
 * NTP SYNCING
 */


/**
 * APP ROUTES
 */
// Web Pages
app.get('/', routes.index);

// APIs
app.get('/mcore/:base/:api', mcore);
app.post('/mcore/:base/:api', mcore);
app.get('/mzero25/:base/:api', mzero25);
app.post('/mzero25/:base/:api', mzero25);

/**
 * APP RELATED FUNCTIONS
 */

/**
 * ERROR HANDLING
 */


/**
 * SERVER START
 */

http.createServer(app).listen(app.get('port'), function () {
    var production = environment + ' mode';
    console.log(production + ' - server listening on port ' + app.get('port'));
});

process.on('uncaughtException', function (err) {
    var errorThread = err.stack;
    console.log(errorThread);
});

process.on( 'SIGINT', function() {
    //shutting down
    console.log('Shutting down MongoDB connection');
    mongoose.connection.close();
    console.log('Exiting');
    // some other closing procedures go here
    process.exit();
});