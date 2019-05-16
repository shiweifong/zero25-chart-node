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
var syncEventsFromDirectory= exports.syncEventsFromDirectory = function(req, res, override, callback, apiOptions){
    var filesContent = "";
    var parsedData = [];
    var groupedData = {};
    var averageData = [];

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
            console.log('Grouping By Day')

            // group by day
            var dayGroup = _.groupBy(parsedData, 'day');

            // loop through day and group by hour
            console.log('Grouping By Hour')
            var hourGroup = {};
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

                        var avgDate = moment({ year :qYear, month :qMonth, day :qDay, hour :quarterData.hour, minute :minutes}).toISOString();

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
            syncWithDatabase();
        }
    ], function(err){
        if (err){
            apiHelper.apiResponse(req, res, true, 500, err, null, null, null, callback);
        }else{
            apiHelper.apiResponse(req, res, null, null, null, null, averageData, null, callback);
        }
    })
};