/*
 * Event Model
 * Copyright UP Technology
 *
 */

var Schema = mongoose.Schema;

eventScheme = new Schema({
    ion : {type : String, default : null}
    , device_id : {type : String, default : null}
    , create_date : {type : Date, default : null}
});

mongoose.model('event', eventScheme, 'event');