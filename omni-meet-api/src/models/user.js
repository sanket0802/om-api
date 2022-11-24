import mongoose from 'mongoose'
const opts = { timestamps: { currentTime: () => Math.round(new Date().getTime()) }}
const UserSchema = mongoose.Schema({
  fullName: { type: String, required: true, trim: true, default: 'Guest' },
  email: { type: String, required: true, trim: true },
  password:{type: String, required: true, trim: true, select: false},
  tenant_id:{type: mongoose.Schema.Types.ObjectId,required:true, ref: 'Tenant'},
  role_id:{type: mongoose.Schema.Types.ObjectId,required:true, ref: 'Role'},
  display_name: { type: String, required: false, trim: true},
  designation: { type: String, required: false, trim: true},
  createdAt: Number,
  updatedAt: Number,
}, opts) 

module.exports = UserSchema
