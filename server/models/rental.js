const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
    title:{type:String, require:true, max:[128,'Too long, ax. 128 chars']},
    city:{type:String,require:true, lowercase:true},
    street:{type:String,require:true, min:[4,'Too short min. 4 chars.']},
    category:{type:String,require:true,lowercase:true},
    image:{type:String,require:true},
    bedrooms: Number,
    shared:Boolean,
    description:{type:String, require:true},
    dailyRate:Number,
    createdAt:{type:Date, default:Date.now},
    user:{type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports=mongoose.model('Rental', rentalSchema);