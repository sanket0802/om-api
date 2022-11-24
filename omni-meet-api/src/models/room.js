import mongoose from 'mongoose'
const opts = { timestamps: { currentTime: () => Math.round(new Date().getTime()) }}

const RoomSchema=mongoose.Schema({
    room_name:{type:String,required:true,trim:true},
    room_id:{type:Number,required:true},
    room_link:{type:String,required:false},
    room_desc:{type:String,required:false},
    room_type:{type:String,required:true,enum:['offline','online'],default:'offline'},
    status: {type:String,required:true,enum:['available','occupied'],default:'available'},
    tenant_id:{type: mongoose.Schema.Types.ObjectId,required:true, ref:'Tenant'},
    amenities:{type: [String], required:false},
    //room_lead:{type: mongoose.Schema.Types.ObjectId,required:false, ref:'User'},
    // from_time:{type:Number,required:false},
    // end_time:{type:Number,required:false},
    meeting_id:[{type: mongoose.Schema.Types.ObjectId,required:false, ref:'Meeting'}]

},opts)

module.exports=RoomSchema
