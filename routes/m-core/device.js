/*
 * AST Core Device API Mongo
 *
 * Copyright 2015 Astralink Technology
 *
 * Version 2.2
 * Release date - 2015-05-12
 * Released by - Fong Shi Wei
 *
 * Change Log
 * ----------
 * Add Device now checks for duplication of custom device ID
 * Added door support to device
 * Added unset door functionality to update device
 * Added population for doors
 * Removed Add Device duplication for custom device, use custom error code 11000 to determine duplicate
 * Added integer prefix support to device
 *
 */

// Generic get method for device 
// Authorized - Admin, System Admin
var getDevice = exports.getDevice = function(req, res, override, callback, apiOptions){
        var totalSizeCount = false;
        var pageSize = null;
        var skipSize = null;

        var queryParms = {};

        //key parameters
        if (req.query.DeviceId) queryParms._id = req.query.DeviceId;
        if (req.query.Name) queryParms.name = req.query.Name;

        //paging paramters
        if (req.query.TotalSizeCount) totalSizeCount = req.query.TotalSizeCount;
        if (req.query.PageSize && !isNaN(req.query.PageSize)) pageSize = parseInt(req.query.PageSize);
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
        var deviceFields = {};

        deviceFields.__v = 0;

        //default hidden hash fields
        if (options.deviceFields) deviceFields = options.deviceFields;

        //filter selection
        //prior to the query parms, users extend parameters
        if (options.queryParms) _.extend(queryParms, options.queryParms);

        //count the total number of rows.
        mongoose.model('device')
            .find(queryParms)
            .select(deviceFields)
            .skip(skipSize)
            .limit(pageSize)
            .sort(sort)
            .exec(function(err, data){
                if (totalSizeCount){
                    mongoose.model('device').find(queryParms).count().exec(function(err, count){
                        apiHelper.getRes(req, res, err, data, count,callback);
                    })
                }else{
                    apiHelper.getRes(req, res, err, data, null, callback);
                }
            });
    };

// Generic add method for device 
// Authorized - Admin, System Admin
var addDevice = exports.addDevice = function(req, res, override, callback){
            var addParms = {};

        //default values

        if (req.body.Name) addParms.name = req.body.Name;

        //check for device ID duplicates
        var newDeviceObj = null;
        var newDeviceId = null;
        var deviceModel =  mongoose.model('device');
        async.waterfall([
            function(addDeviceCallback){
                //add the device
                var newDevice = new deviceModel(addParms);
                newDevice.save(function (err, data) {
                    if (!err && data){
                        newDeviceObj = data;
                        newDeviceId = data._id;
                        addDeviceCallback();
                    }else{
                        addDeviceCallback(err);
                    }
                });
            }
        ], function (err) {
            if (err){
                apiHelper.addRes(req, res, err, null, callback);
            }else{
                apiHelper.addRes(req, res, null, newDeviceObj, callback);
            }
        });
};

// Generic update method for device 
// Authorized - Admin, System Admin
var updateDevice = exports.updateDevice = function(req, res, override, callback){
    if (
        req.body.DeviceId
    ) {
        //Querying Object
        var queryParms = {};
        if (req.body.DeviceId) queryParms._id = req.body.DeviceId;

        //Editing Object
        var updateParms = {};
        updateParms.$unset = {};

        //default values
        updateParms.last_update = dateTimeHelper.utcNow();

        //parameter values
        if (req.body.Name) updateParms.name = req.body.Name;

        //unset features

        //final check on unset to prevent errors
        var updateDeviceObj = null;
        var deviceModel = mongoose.model('device');
        async.waterfall([
                function (updateDeviceCallback) {
                    //update enterprise
                    deviceModel.update(
                        queryParms
                        , updateParms
                        , {multi: true}
                        , function (err, data) {
                            if (!err && data) {
                                updateDeviceObj = data;
                                updateDeviceCallback();
                            } else {
                                updateDeviceCallback(err);
                            }
                        });
                }]
            , function (err) {
                if (err) {
                    apiHelper.updateRes(req, res, err, null, null, callback);
                } else {
                    var numberAffected = null;
                    if (updateDeviceObj) numberAffected = updateDeviceObj.nModified;
                    apiHelper.updateRes(req, res, null, updateDeviceObj, numberAffected, callback);
                }
            });
    } else {
        apiHelper.apiResponse(req, res, true, 500, "Not found", null, null, null, callback);
    }
};

// Generic delete method for device 
// Authorized - Admin, System Admin
var deleteDevice = exports.deleteDevice = function(req, res, override, callback){
    if (
        req.body.DeviceId
    ) {
        var queryParms = {};
        if (req.body.DeviceId) queryParms._id = req.body.DeviceId;

        var deviceModel = mongoose.model('device');
        deviceModel.remove(queryParms).exec(function (err, numberRemoved) {
            apiHelper.deleteRes(req, res, err, numberRemoved, callback);
        });
    } else {
        apiHelper.apiResponse(req, res, true, 500, "Not found", null, null, null, callback);
    }
}
