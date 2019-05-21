/*
 * Event API Mongo
 * Copyright UP Technology
 */


function concatFilesFromDirectory(dirname, returnedContent, onError) {
    fs.readdir(dirname, function(err, filenames) {
        if (err) {
            onError(err);
            return;
        }
        var concatContent = "";
        async.eachSeries(filenames, function(filename, fileRead){
            if(! /^\..*/.test(filename)) {
                fs.readFile(dirname + filename, 'utf-8', function(err, content) {
                    if (err) {
                        onError(err);
                        return;
                    }
                    concatContent += content;
                    fileRead();
                });
            }else{
                fileRead();
            }
        }, function(err){
            if (err) {
                onError(err);
            }else{
                returnedContent(concatContent);
            }
        })
    });
}

// Generic get method for event
// Authorized - Admin, System Admin
var getAirIonData = exports.getAirIonData = function(req, res, override, callback, apiOptions){
    eventController.getEvent(req, res, true, function(resGetEventDataErr, resGetEventData, resGetEventDataRowsReturned, resGetEventDataTotalRows){
        if (!resGetEventDataErr && resGetEventDataRowsReturned){
            apiHelper.getRes(req, res, null, resGetEventData, resGetEventDataTotalRows, callback);
        }else{
            apiHelper.getRes(req, res, resGetEventDataErr, null, null, callback);
        }
    });
};

// Generic get method for event
// Authorized - Admin, System Admin
var syncEventsFromDirectory= exports.syncEventsFromDirectory = function(req, res, override, callback, apiOptions){
    var filesContent = ""
        , parsedData = []
        , groupedData = {}
        , deviceId = "5ce2360dc09bea9959745479"
        , averageData = []
        , error = false
        , errorDesc
        , errorCode;


    async.waterfall([
        function(readDataDir){
            var data = {};
            concatFilesFromDirectory(__root + '/data/', function(content) {
                filesContent = content;
                readDataDir();
            }, function(err) {
                readDataDir(err);
            });

        }
        , function(parseRawFilesCb){
            filesContent = filesContent.split('\r\n');
            _.each(filesContent, function(file) {
                var ion = file.substr(1, 4);
                var date = file.substr(5);
                date = date.trim();
                date = moment(moment(date).format("YYYY-MM-DDTHH:mm:ss") + moment.tz(moment(), "Asia/Singapore").format("Z")).toISOString();
                var day = moment(date).format("YYYY-MM-DD");
                var hour = parseInt(moment(date).format("HH"));
                var minutes = parseInt(moment(date).format("mm"));
                var year = parseInt(moment(date).format("YYYY"));
                var month = parseInt(moment(date).format("MM")) - 1;
                var day = parseInt(moment(date).format("DD"));

                var quarter;
                if (minutes > 44 && minutes < 59){
                    quarter = 4;
                }else if (minutes > 29 && minutes < 45){
                    quarter = 3;
                }else if (minutes > 14 && minutes < 30){
                    quarter = 2;
                }else if (minutes >= 0 && minutes < 15){
                    quarter = 1;
                }

                ion = parseInt(ion)*1000;

                var ionEvent = {
                    "ion_count" : ion,
                    "datetime" : date,
                    "year": year,
                    "month": month,
                    "day" : day,
                    "hour" : hour,
                    "minutes" : minutes,
                    "quarter" : quarter
                }

                if (ionEvent.ion_count && quarter) parsedData.push(ionEvent);
            });
            parseRawFilesCb();
        }
        ,function(groupParsedData){

            // group by day
            var dayGroup = _.groupBy(parsedData, 'day');

            // loop through day and group by hour
            _.map(dayGroup, function(val, key){
                groupedData[key] = _.groupBy(val, 'hour');
            })


            groupParsedData();
        }
        , function(calculateAverage){
            // take the average of each quarter
            _.map(groupedData, function(dayData, day){
                // loop through each hour's data and group them

                _.map(groupedData[day], function(hourData, hour){
                    var quarterDataObj = _.groupBy(hourData, 'quarter');

                    _.map(quarterDataObj, function(quarterData, quarter){

                        var qDataLength = quarterData.length;
                        var qDataTotal = 0;

                        var qYear, qMonth, qDay;
                        _.each(quarterData, function(qData){
                            qDataTotal += qData.ion_count;
                            qYear = qData.year;
                            qMonth = qData.month;
                            qDay = qData.day;
                        })
                        var qDataAvg = Math.round(qDataTotal / qDataLength);

                        if (quarter == 1) {
                            minutes = 0
                        }else if(quarter == 2){
                            minutes = 15
                        }else if (quarter == 3){
                            minutes = 30
                        }else if (quarter == 4){
                            minutes = 45
                        }

                        var avgDate = moment({ year :qYear, month :qMonth, day :qDay, hour :hour, minute :minutes}).toISOString();

                        var averageDataObj = {
                            "ion_count_average" : qDataAvg,
                            "date" : avgDate
                        };

                        averageData.push(averageDataObj);
                    })
                })
            })
            calculateAverage();
        }
        , function(syncWithDatabase){
            // loop through each data, prep them and sync with database
            async.eachSeries(averageData, function(eventData, eventDataSync){

                var eventExists = false;
                var eventId = null;
                async.waterfall([
                    function(checkIfEventExists) {
                        var getEventReq = _.clone(req);
                        getEventReq.query = {};
                        getEventReq.query.CreateDate = moment(eventData.date).toISOString();
                        eventController.getEvent(getEventReq, res, true, function (err, data, dataLength) {
                                if (!err) {
                                    if (dataLength) {
                                        eventExists = true;
                                        eventId = _.first(data)._id;
                                    }else{
                                        eventExists = false;
                                    }
                                    checkIfEventExists();
                                }else{
                                    checkIfEventExists(err);
                                }
                            });
                    }
                    , function(syncEvent){
                        if (!eventExists){
                            // insert
                            var addEventReq = _.clone(req);
                            addEventReq.body = {};
                            addEventReq.body.Data = eventData.ion_count_average;
                            addEventReq.body.CreateDate = moment(eventData.date).toISOString();
                            addEventReq.body.Device = deviceId;
                            eventController.addEvent(addEventReq, res, true, function (err, data, dataLength) {
                                if (!err) {
                                    console.log("Event Added");
                                    syncEvent();
                                }else{
                                    syncEvent(err);
                                }
                            });
                        }else{
                            // update
                            if (eventId){
                                console.log(eventId);
                                var updateEventReq = _.clone(req);
                                updateEventReq.body = {};
                                updateEventReq.body.EventId = eventId;
                                updateEventReq.body.Data = eventData.ion_count_average;
                                eventController.updateEvent(updateEventReq, res, true, function (err, data, dataLength) {
                                    if (!err) {
                                        console.log("Event Updated");
                                        syncEvent();
                                    }else{
                                        syncEvent(err);
                                    }
                                });
                            }else{
                                syncEvent();
                            }
                        }
                    }
                ], function(err){
                    console.log(err);
                    if (!err){
                        eventDataSync();
                    }else{
                        eventDataSync(err);
                    }
                })
            }, function(err){
                if (!err){
                    syncWithDatabase();
                }else{
                    syncWithDatabase(err);
                }
            })
        }
    ], function(err){
        if (err){
            apiHelper.apiResponse(req, res, true, 500, err, null, null, null, callback);
        }else{
            apiHelper.apiResponse(req, res, null, null, null, null, averageData, null, callback);
        }
    })
};