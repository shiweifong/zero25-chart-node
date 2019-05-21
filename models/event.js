/*
 * Event Model
 *
 */

var Schema = mongoose.Schema;

eventScheme = new Schema({
    data : {type : String, default : null}
    , create_date : {type: Date, default: null}
    , device : {type: Schema.Types.ObjectId, ref: 'device'}
});

mongoose.model('event', eventScheme, 'event');