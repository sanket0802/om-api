import mongoose from 'mongoose'
const opts = { timestamps: { currentTime: () => Math.round(new Date().getTime()) }}

const TenantSchema=mongoose.Schema({
    tenant_name:{type:String,required:true},
    tenant_email:{type:String,required:true},
    tenant_mobile:{type:String,required:true},
    tenant_password:{type:String,required:true,select: false},
    status: {type:String,required:true,enum:['active','inactive'],default:'active'},
    subscription: {type:String, required:true}, 
    maxRoomsAllowed: {type:Number, required:true},
    createdAt: Number,
    updatedAt: Number,
},opts)

module.exports=TenantSchema
