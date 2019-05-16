/*
 * Event API Mongo
 * Copyright UP Technology
 */


// Generic get method for event
// Authorized - Admin, System Admin
var getEvent = exports.getEvent = function(req, res, override, callback, apiOptions){
    var totalSizeCount = null;
    var pageSize = null;
    var skipSize = null;

    var queryParms = {};

    //key parameters
    if (req.query.EventId) queryParms._id = req.query.EventId;
    if (req.query.Ion) queryParms.ion = req.query.Ion;

    //paging parameters
    if (req.query.PageSize && !isNaN(req.query.PageSize)) pageSize = parseInt(req.query.PageSize);
    if (req.query.TotalSizeCount) totalSizeCount = req.query.TotalSizeCount;
    if (req.query.PageSize && !isNaN(req.query.SkipSize)) skipSize = parseInt(req.query.SkipSize);

    //additional options
    var options = {};
    if (apiOptions){
        options = apiOptions;
    }
    //sort options
    var sort = {};
    if (options.sort) sort = options.sort;

    //second level population
    var nestedPopulation = {};
    if (options.nestedPopulation) nestedPopulation = options.nestedPopulation;

    //field selection option
    var eventFields = {};

    eventFields.__v = 0;

    //default hidden hash fields

    if (options.eventFields) eventFields = options.eventFields;

    //filter selection

    //prior to the query parms, users extend parameters
    if (options.queryParms) _.extend(queryParms, options.queryParms);

    mongoose.model('event')
        .find(queryParms)
        .select(eventFields)
        .skip(skipSize)
        .limit(pageSize)
        .sort(sort)
        .lean()
        .exec(function (err, data) {
            if (totalSizeCount){
                mongoose.model('event').find(queryParms).count().exec(function(err, count){
                    apiHelper.getRes(req, res, err, data, count,callback);
                })
            }else{
                apiHelper.getRes(req, res, err, data, null, callback);
            }
        });
};

// Generic add method for event
// Authorized - Admin, System Admin
var addEvent = exports.addEvent = function(req, res, override, callback){
    if (
        req.body.Entity
    ) {
        var addParms = {};

        //default values
        addParms.create_date = dateTimeHelper.utcNow();

        //parameter values
        if (req.body.Ion) addParms.ion = req.body.Ion;
        if (req.body.DeviceId) addParms.device = req.body.DeviceId;
        if (req.body.CreateDate) addParms.create_date = req.body.CreateDate;

        var newEventObj = null;
        var newEventId = null;
        var eventModel =  mongoose.model('event');
        async.waterfall([
            function(addEventCallback){
                //add the event
                var newEvent = new eventModel(addParms);
                //add the new event
                newEvent.save(function (err, data) {
                    if (!err && data){
                        newEventObj = data;
                        newEventId = data._id;
                        addEventCallback();
                    }else{
                        addEventCallback(err);
                    }
                });
            }
        ], function (err) {
            if (err){
                apiHelper.addRes(req, res, err, null, callback);
            }else{
                apiHelper.addRes(req, res, null, newEventObj, callback);
            }
        });
    } else {
        apiHelper.apiResponse(req, res, true, 500, "Not found", null, null, null, callback);
    }
};

// Generic delete method for event
// Authorized - Admin, System Admin
var deleteEvent = exports.deleteEvent = function(req, res, override, callback){
    if (
        req.body.EventId
    ) {
        var queryParms = {};
        if (req.body.EventId) queryParms._id = req.body.EventId;

        var eventModel = mongoose.model('event');
        eventModel.remove(queryParms).exec(function (err, numberRemoved) {
            apiHelper.deleteRes(req, res, err, numberRemoved, callback);
        });
    } else {
        apiHelper.apiResponse(req, res, true, 500, "Not found", null, null, null, callback);
    }
};
