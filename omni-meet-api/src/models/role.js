import mongoose from 'mongoose'
const opts = { timestamps: { currentTime: () => Math.round(new Date().getTime()) }}

const roleSchema=mongoose.Schema({
    role_name:{type:String,required:true, enum:['SuperAdmin','TenantAdmin','Organizer','User'], default: "User"}
},opts)

module.exports=roleSchema