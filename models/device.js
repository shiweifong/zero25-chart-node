/*
 * Device Model
 *
 */

var Schema = mongoose.Schema;

deviceSchema = new Schema({
    name : {type: String, default: null}
});

mongoose.model('device', deviceSchema, 'device');