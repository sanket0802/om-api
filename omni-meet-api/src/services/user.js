import {User} from '../models/model'
import _, { rearg } from 'lodash'
import {ObjectId} from 'mongodb'

const userFields = [
  'fullName',
  'email',
  'password',
  'designation',
  'display_name',
]

export async function  getUserWithId(req, res){   
    try {
      let user = await User.findById(req.params.userId)
      if (_.isNull(user)) 
        return res.status(404).send({success: false, message: `Customer with id ${req.params.userId} does not exist`, statusCode: 404})
      res.status(200).send(user)
    } catch(e) {
      res.status(500).send(e)
    }
  }

  export async function loginWithmobile(req, res) { 
    try {
      const { email,password} = req.body
        let user = await User.findOne({ email: email,password:password}).select('_id fullName mobile tenant_id role_id display_name designation').populate({path: 'tenant_id role_id'})
        if (_.isNull(user)){
            return res.status(404).send({success: false, message: `user with mobile ${req.body.mobile} does not exist`, statusCode: 404})
          }
        res.status(200).send({success: true, data: user, statusCode: 200}) 
      
    } catch(err) {
      res.status(500).json({message:err.message})
    }
  }
  
  export async function  updateUserById(req, res){   
    try {
      let pickedUser = _.pick(req.body, userFields)
      let updatedUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        pickedUser,
        { new: true })
      if (_.isNull(updatedUser))
        return res.status(404).send({success: false, message: `User with id:  ${req.params.id} does not exist`, statusCode: 404})
      res.status(200).send(updatedUser)
    } catch(e) {
      res.status(500).send(e.msg)
    }
  }