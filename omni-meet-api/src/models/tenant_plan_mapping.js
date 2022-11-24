import mongoose from 'mongoose'
const opts = { timestamps: { currentTime: () => Math.round(new Date().getTime()) }}

const tenant_plan_mappingSchema=mongoose.Schema({
    plan_id:{type: mongoose.Schema.Types.ObjectId,required:true, ref:'Plan'},
    tenant_id:{type: mongoose.Schema.Types.ObjectId,required:true, ref:'Tenant'},
    maxRoomsAllowed:{type:Number ,required:true},
    occupiedRoomCount:{type:Number},
},opts)

module.exports=tenant_plan_mappingSchema