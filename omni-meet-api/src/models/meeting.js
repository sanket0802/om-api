import mongoose from 'mongoose'
const opts = { timestamps: { currentTime: () => Math.round(new Date().getTime()) }}

const MeetingSchema=mongoose.Schema({
    leadId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},
    roomId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'Room'},
    status:{type:String,required:true,enum:['upcoming','ongoing','completed','cancelled'],default:'upcoming'},
    date:{type:Number,required:true},
    from_time:{type:Number,required:true},
    end_time:{type:Number,required:true},
    meeting_desc:{type:String,required:false},
    meeting_name:{type:String,required:true},
    users:[{type: mongoose.Schema.Types.ObjectId, required: false ,ref: 'User'}]
},opts)

module.exports = MeetingSchema