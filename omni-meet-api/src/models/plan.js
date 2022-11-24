import mongoose from 'mongoose'
const opts = { timestamps: { currentTime: () => Math.round(new Date().getTime()) }}

const planSchema=mongoose.Schema({
    plan_name:{type:String,required:true},
    maxRoomsAllowed:{type:Number ,required:true},
    features:{type:String,required:false,default:""},
},opts)

module.exports=planSchema