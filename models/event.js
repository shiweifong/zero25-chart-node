/*
 * Event Model
 * Copyright UP Technology
 *
 */

var Schema = mongoose.Schema;

eventScheme = new Schema({
    ion : {type : String, default : null}
    , device_id : {type : String, default : null}
    , day : {type : String, default : null}
    , hour : {type : String, default : null}
    , quarter : {type : String, default : null}
    , date_time : {type: Date, default: null}
});

mongoose.model('event', eventScheme, 'event');