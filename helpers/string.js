/*
 * AST String Helper
 *
 * Copyright 2015 Astralink Technology
 *
 * Version 2.2
 * Release date - 2015-05-12
 * Released by - Fong Shi Wei
 *
 * Change Log
 * ----------
 * Support for Pad Front Added
 *
 */

var pluralize = exports.pluralize = function (count, noun) {
    var englishTeacher = noun.substr(noun.length - 1);
    var strictWords = [
        'day'
    ];

    var isStrict = false;
    if(_.indexOf(noun, strictWords) != -1 ){
        isStrict = true;
    }
    if (noun){
        if (count > 1){
            if (!isStrict){
                if (englishTeacher == 'f'){
                    var pos = noun.lastIndexOf('f');
                    noun = noun.substring(0,pos) + 'ves'
                }else if (englishTeacher == 'y'){
                    var pos = noun.lastIndexOf('y');
                    noun = noun.substring(0,pos) + 'ies'
                }else{
                    noun += 's';
                }
            }else{
                noun += 's';
            }
            return noun;
        }else{
            return noun;
        }
    }else{
        return noun;
    }
}

var parseExtraDataToArrayOfObjects = exports.parseExtraDataToArrayOfObjects = function(req, res, extraData){
    if (extraData){
        extraData = ('[{"' + extraData + '"}]').replace(/;/g, '"}, {"');
        extraData = (extraData).replace(/&/g, '" , "');
        extraData = extraData.replace(/:/g, '":"');
        try{
            extraData = JSON.parse(extraData)
        }catch (e){
            extraData = null;
        }
        return extraData;
    }else{
        return null;
    }
}

var toTitle = exports.toTitle = function (req, res, value){
    if (value){
        // strip all the underscores
        var value = value.replace(/_/g, ' ');
        // capitalize
        value = value.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
        return value;
    }else{
        return null;
    }
}

var toAnName = exports.toAnName = function (req, res, name){
    var name = name.replace(/\W/g, ''); // remove non alpha numeric
    name = name.replace(/ /g, '-'); // remove spaces
    name = name.toLowerCase(); // lowercase
    return name;
}

var padFront = exports.padFront = function (req, res, num, size){
    var padded = num + "";
    while (padded.length < size) padded = "0" + padded;
    return padded;
}

var toName = exports.toName = function (req, res, firstName, lastName){
    var name = null;
    if (firstName && lastName){
        name = firstName + ' ' + lastName;
    }else if (firstName){
        name = firstName;
    }else if (lastName){
        name = lastName;
    }
    return name;
}

var addressParser = exports.addressParser = function (req, res, apartment, road, road2, suite, city, state, province, country, zip){
    var addressString = '';

    if (apartment) addressString += apartment + " ";
    if (road) addressString += road + " ";
    if (road2) addressString += road2 + " ";
    if (suite) addressString += suite + " ";
    if (city) addressString += city + " ";
    if (state) addressString += state + " ";
    if (province) addressString += province + " ";
    if (country) addressString += country + " ";
    if (zip) addressString += zip + " ";

    if (!addressString){
        addressString = null;
    }

    return addressString;
}

var logTextGeneration = exports.logTextGeneration = function(action, type, entity, targetEntity, device, targetDevice, enterprise, targetEnterprise){

    var logText = null;

    if (action == 'login') {
        logText = entity.name + ' logged in to Lifecare Web Portal.'
    }else if (action == 'logout'){
        logText = entity.name + ' logged out from Lifecare Web Portal.'
    }else if (action == 'app-login'){
        logText = entity.name + ' logged in to Lifecare Mobile App.'
    }else if (action == 'app-logout'){
        logText = entity.name + ' logged out from Lifecare Mobile App.'
    }else if (action == 'request-change-password'){
        logText = entity.name + ' sent a change password request.'
    }else if (action == 'change-password'){
        logText = entity.name + ' has changed his/her password.'
        if (targetEntity) logText =  entity.name + ' changed ' + targetEntity.name  + '\'s password';
    }

    return logText;
}

var parseOriginalDeviceId = exports.parseOriginalDeviceId = function(deviceId){
    if (deviceId && deviceId.length == 12 && deviceId.substring(1, 5) == "0a78"){
        deviceId = "9" + deviceId.substring(1);
        var parsedDeviceId = "";
        _.times(deviceId.length, function(n){
            parsedDeviceId += deviceId.charAt(n);
            if (_.indexOf([1, 3, 5, 7, 9], n) != -1) parsedDeviceId += ":";
        })
        if (parsedDeviceId) parsedDeviceId= parsedDeviceId.toUpperCase();
        deviceId = parsedDeviceId;
    }
    return deviceId;
}

var differenceArrayObjects = exports.differenceArrayObjects = function(array1, array2){
    if (array1 && array2 && _.isArray(array1) && _.isArray(array2)){

        // console.log(array1);
        // console.log(array2);
        var strArray1 = [];
        var strArray2 = [];
        var strDiffArray = [];
        var diffArray = [];

        _.each(array1, function(obj){
            strArray1.push(JSON.stringify(obj));
        })

        _.each(array2, function(obj){
            strArray2.push(JSON.stringify(obj));
        })

        strDiffArray = _.difference(strArray2, strArray1);

        if (strDiffArray && _.isArray(strDiffArray) && !_.isEmpty(strDiffArray)){
            _.each(strDiffArray, function(strObj){
                diffArray.push(JSON.parse(strObj));
            })
        }

        return diffArray;
    }else{
        return null;
    }
}

var lifecareRuleTextGeneration = exports.lifecareRuleTextGeneration = function (startTime, endTime, zone, activityType, alertDuration, alertInterval, alertThresholds, ruleName, intValue, latitude, longitude, ruleFormattedAddress) {

    var ruleText = "Alert ";
    if (activityType == 'geofence-on-exit'){
        if (ruleFormattedAddress) {
            ruleText += "if user leaves the area of " + intValue + "km from " + ruleFormattedAddress;
        }else{
            ruleText += "if user leaves the area of " + intValue + "km from N:" + latitude + "; E:" + longitude;
        }
    }else if (activityType == 'geofence-on-entry'){
        if (ruleFormattedAddress) {
            ruleText += "if user enter the area of " + intValue + "km from " + ruleFormattedAddress;
        }else{
            ruleText += "if user enter the area of " + intValue + "km from N:" + latitude + "; E:" + longitude;
        }
    }else if (activityType == 'bpt'){
        // blood pressure alerting
        _.each(alertThresholds, function(threshold){
            if ((threshold.int_range_start || threshold.int_range_start == 0) && (threshold.int_range_end || threshold.int_range_end == 0)){
                ruleText += "if blood pressure systolic is between " + threshold.int_range_start + "mmHg to " + threshold.int_range_end + "mmHg. "
            } else if ((threshold.int_range_start || threshold.int_range_start == 0) && (!threshold.int_range_end)){
                ruleText += "if blood pressure systolic exceeds " + threshold.int_range_start + "mmHg. "
            } else if ((!threshold.int_range_start) && (threshold.int_range_end || threshold.int_range_end == 0)){
                ruleText += "if blood pressure systolic falls below " + threshold.int_range_end + "mmHg. "
            }

            if ((threshold.int_range_start2 || threshold.int_range_start2 == 0) && (threshold.int_range_end2 || threshold.int_range_end2 == 0)){
                ruleText += "Diastolic is between " + threshold.int_range_start2 + "mmHg to " + threshold.int_range_end2 + "mmHg."
            } else if ((threshold.int_range_start2 || threshold.int_range_start2 == 0) && (!threshold.int_range_end2)){
                ruleText += "Diastolic exceeds " + threshold.int_range_start2 + "mmHg."
            } else if ((!threshold.int_range_start2) && (threshold.int_range_end2 || threshold.int_range_end2 == 0)){
                ruleText += "diastolic falls below " + threshold.int_range_end2 + "mmHg."
            }
        })
    }else if (activityType == 'glut'){
        // glucose alerting
        _.each(alertThresholds, function(threshold) {
            if ((threshold.int_range_start || threshold.int_range_start == 0) && (threshold.int_range_end || threshold.int_range_end == 0)) {
                ruleText += "if blood sugar level is between " + threshold.int_range_start + "mmol/L to " + threshold.int_range_end + "mmol/L. "
            } else if ((threshold.int_range_start || threshold.int_range_start == 0) && (!threshold.int_range_end)) {
                ruleText += "if blood sugar level exceeds " + threshold.int_range_start + "mmol/L. "
            } else if ((!threshold.int_range_start) && (threshold.int_range_end || threshold.int_range_end == 0)) {
                ruleText += "if blood sugar level falls below " + threshold.int_range_end + "mmol/L. "
            }
        });
    }else if (activityType == 'battery'){
        // battery alerting
        _.each(alertThresholds, function(threshold) {
            if ((threshold.int_range_end || threshold.int_range_end == 0)) {
                ruleText += "if daily falls below " + threshold.int_range_end + "%. "
            }
        });
    }else if (activityType == 'daily-water-threshold'){
        // water threshold alerting
        ruleText += "water usage is above " + intValue + " cu M."
    }else if (activityType == 'daily-energy-threshold'){
        ruleText += "energy usage is above " + intValue + " kWh."
    }else if (activityType == 'sys-heart-beat'){
        // battery alerting
        var device = ruleName.substring(0, ruleName.indexOf('Offline'));
        if (device) device = device.toLowerCase();
        ruleText += "if " + device + " goes offline.";
    }else if (activityType == 'on-panic'){
        // battery alerting
        ruleText += "if panic button is pressed.";
    }else{
        var calculatedInterval = "";
        var calculatedDuration = "";

        if (alertInterval >= 60 && (alertInterval % 60 == 0)){
            calculatedInterval = (alertInterval / 60) + " " + pluralize((alertInterval / 60), 'hour') + " ";
        }else{
            calculatedInterval = alertInterval + " " + pluralize(alertInterval, 'minute') + " ";
        }

        if (activityType == 'inactivity' || activityType == "duration"){
            if (alertDuration >= 60 && (alertDuration % 60 == 0)){
                calculatedDuration = (alertDuration / 60) + " " + pluralize((alertDuration / 60), 'hour') + " ";
            }else{
                calculatedDuration = alertDuration + " " + pluralize(alertDuration, 'minute') + " ";
            }
        }

        if (calculatedInterval) {
            ruleText + "every " + calculatedInterval + " ";
        }

        if (activityType == 'on-no-activity'){
            ruleText += "if inactivity is detected ";
        }else if (activityType == 'on-no-usage'){
            ruleText += "if no water usage is detected ";
        }else if (activityType == 'on-activity'){
            ruleText += "if activity is detected ";
        }else if (activityType == 'duration'){
            ruleText += "if time spent ";
        }else if (activityType == "inactivity"){
            ruleText += "if inactivity period detected ";
            ruleText += "is more than " + calculatedDuration;
        }else if (activityType == 'on-no-vsm-BP'){
            ruleText += "if blood pressure was not taken ";
        }else if (activityType == 'on-no-vsm-GR'){
            ruleText += "if glucose levels was not taken ";
        }else if (activityType == 'on-no-vsm-WS'){
            ruleText += "if weight was not taken ";
        }else if (activityType == 'on-no-vsm-TM'){
            ruleText += "if body temperature was not taken ";
        }else if (activityType == 'attend-class'){
            ruleText += "if student / child reports or returns to class.";
        }else if (activityType == 'leave-class'){
            ruleText += "if student / child leaves during class.";
        }else{
            ruleText += "if " + activityType + " detected ";
        }

        // ZONE INDICATOR
        if (
            activityType != 'on-no-vsm-BP' &&
            activityType != 'on-no-vsm-GR' &&
            activityType != 'on-no-vsm-WS' &&
            activityType != 'on-no-vsm-TM' &&
            activityType != 'attend-class' &&
            activityType != 'leave-class'
        ){
            if (zone && zone != 'All'){
                ruleText += "in the " + zone.toLowerCase();
            }else{
                ruleText += "in the whole house";
            }
        }

        if (activityType == "duration"){
            ruleText += " for more than " + calculatedDuration ;
        }

        var startHour = Math.floor( startTime / 60);
        var startMinutes = startTime % 60;

        var endHour = Math.floor( endTime / 60);
        var endMinutes = endTime % 60;

        if (
            activityType != 'attend-class' &&
            activityType != 'leave-class'
        ){
            ruleText += " from " + moment({hour: startHour, minute: startMinutes}).format("h:mma") + " to ";

            if (
                activityType == 'on-no-vsm-BP' ||
                activityType == 'on-no-vsm-GR' ||
                activityType == 'on-no-vsm-WS' ||
                activityType == 'on-no-vsm-TM'
            ){
                // if the readings are no VS readings, the end hour is modified to be 2 hours before the end hour.
                if (endHour >= 2){
                    endHour -= 2;
                }else{
                    endHour = endHour + 24 - 2;
                }
                ruleText += moment({hour: endHour, minute: endMinutes}).format("h:mma");
            }else{
                ruleText += moment({hour: endHour, minute: endMinutes}).format("h:mma");
            }
        }

    }

    return ruleText;
}


var parseExtraData = exports.parseExtraData = function(extraData, eventTypeId){
    if (extraData){
        var extraDataRaw = ('{"' + extraData + '"}').replace(/&amp;/g, '" , "');
        extraDataRaw = extraDataRaw.replace(/\n/g, '\\n');
        extraDataRaw = extraDataRaw.replace(/\r/g, '\\r');
        extraDataRaw = extraDataRaw.replace(/&lt;/g, '<');
        extraDataRaw = extraDataRaw.replace(/&gt;/g, '>');
        extraDataRaw = extraDataRaw.replace(/&/g, '" , "');
        extraDataRaw = extraDataRaw.replace(/:/g, '":"');
        if (eventTypeId == '20053' || eventTypeId == 20053) extraDataRaw = extraDataRaw.replace(/"" ,/g, '');
        var extraData = null;
        try{
            extraData = JSON.parse(extraDataRaw);
        }catch(err){
            //forming UTF String
            extraData = {};
            console.log('Error parsing data');
        }
        return extraData;
    }else{
        return null;
    }
}

var passwordGen = exports.passwordGen = function (length, charset) {
    var defLength = 8;
    var defCharset = "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789";
    var pwString = "";

    if (length) defLength = length;
    if (charset) defCharset = charset;

    for (var i = 0, n = defCharset.length; i < defLength; ++i) {
        pwString += defCharset.charAt(Math.floor(Math.random() * n));
    }

    return pwString;
}
