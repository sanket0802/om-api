import {Room,User,UserRoomMapping,Meeting} from '../models/model'
import _, { rearg } from 'lodash'
import {ObjectId} from 'mongodb'


const roomFields = [
    'room_name',
    'room_id',
    'room_link',
    'room_desc',
    'status',
    'tenant_id',
    'amenities'
  ]
  
export async function  getAllRooms(req, res){   
    try {
        let query = {}
        let room
        if (!_.isUndefined(req.query.status)) {
          query['status'] = (req.query.status)          
        }
        // if(!_.isUndefined(req.query.leadId)){
        //   query['room_lead'] = (ObjectId(req.query.leadId))
        // }
        room = await Room.aggregate([
          {$match:  query },
          { $lookup: {
            from:'meetings',
            let:{'roomid':'$_id'},
            pipeline: [
              { $match: { $expr: { $eq: [ '$roomId', '$$roomid'] } } },
              { $lookup: {
                from: 'users',
                let: { 'userId': '$leadId' },
                pipeline: [
                  { $match: { $expr: { $eq: [ '$_id', '$$userId'] } } },
                  { $project: {
                    '_id': 1,
                    fullName: 1,
                    email: 1,
                    display_name: 1,
                  }},
                ],
                as: 'leadDetails',
              }},
              { "$lookup": {
                "from": 'users',
                "let": { "users": "$users" },
                "pipeline": [
                  { "$match": { "$expr": { "$in": [ "$_id", "$$users" ] } } }
                ],
                "as": "usersDetails"
              }},
              { $project: {
                '_id': 1,
                display_name:1,
                date:1,
                from_time: 1,
                end_time: 1,
                meeting_desc: 1,
                users: 1,
                leadDetails:1,
                usersDetails:1,
                status:1,
                meeting_name:1
              }},
            ],
            as: 'meetingDetails',          
          }},  
          // {$match:{ meetingDetails: { $elemMatch: { "meeting_desc" : "cdcsdc"}}}}
        ])        
        
        if (_.isEmpty(room)) 
          return res.status(404).send({success: false, message: 'Room not found', statusCode: 404})
        if(!_.isUndefined(req.query.date)){
          let roomsList=await Promise.all(room.map(async(room)=>{
            let meetings=room.meetingDetails
            var newMeetings =  meetings.filter(function(meeting) {
              return meeting.date == req.query.date;
            });
            room.meetingDetails=newMeetings
          }))
        }
        res.status(200).send(room)
      } catch(e) {
        res.status(500).send(e.message)
      }
  }

  export async function  updateRoomById(req, res){   
    try {
      let pickedRoom = _.pick(req.body, roomFields)
      let updatedRoom = await Room.findOneAndUpdate(
        { _id: req.params.id },
        pickedRoom,
        { new: true })
      if (_.isNull(updatedRoom))
        return res.status(404).send({success: false, message: `Room with id:  ${req.params.id} does not exist`, statusCode: 404})
      res.status(200).send(updatedRoom)
    } catch(e) {
      res.status(500).send(e)
    }
  }

  export async function joinRoom(req, res){   
    try {
      let room_details = await Room.findOne({ room_id: req.body.room_id })
      let user_details = await User.findOne({ _id: req.body.user_id }).select('-password')
      if (_.isNull(room_details))
        return res.status(404).send({success: false, message: `Room with id:  ${req.body.id} does not exist`, statusCode: 404})
      if (_.isNull(user_details))
        return res.status(404).send({success: false, message: `User does not exist`, statusCode: 404})
      let newUser={
        room_id: parseInt(req.body.room_id),
        user_id: req.body.user_id,
        status:'active'
      }
      let newUser_mapping = new UserRoomMapping(newUser)
      let result = await newUser_mapping.save()
      if(!_.isUndefined(result)){
        res.status(200).json({
          msg:"User joined succesfully",
          room_details:room_details,
          user_details:user_details,
        })
      }
    } catch(err) {
      res.status(500).send({message:err.message})
    }
  }
  export async function  createRoom(req, res){
    try{
      let pickedRoom= _.pick(req.body, roomFields)
      let isCreated =  await Room.findOne({room_name: {$regex:"^"+req.body.room_name.trim()+"$",$options:"$i"}})
      if(!_.isNull(isCreated) ) {
        return res.status(409).send({success: false, message: 'This room is already created', statusCode: 409})
      } 
      let last=await Room.find().sort({'_id':-1}).limit(1)
      let total_rooms = await Room.count()
      if(total_rooms < process.env.maxRoomsCreated){
        if(_.isEmpty(last)){
          pickedRoom.room_id=1
          pickedRoom.room_link=process.env.link
        }
        else{
          pickedRoom.room_id=(last[0].room_id)+1
          pickedRoom.room_link=process.env.link
        }
        let newRoom = new Room(pickedRoom)
        let result = await newRoom.save()
        res.status(200).send(result)
      }else{
        res.status(400).send({success: false, message: `Reached your maximum room creation limit`, statusCode: 400})
      }
    }catch(e){
      res.status(500).send(e)
    }
  } 

  //get room by _id

  export async function  getRoomById(req, res){   
    try {
      let getRoom = await Room.findById(req.params.id).populate({path: 'meeting_id',populate:[{ path: 'users' },{ path: 'leadId' }]})
      if (_.isNull(getRoom))
        return res.status(404).send({success: false, message: `Room with id:  ${req.params.id} does not exist`, statusCode: 404})
      if(!_.isUndefined(req.query.date)){
        let meetings=getRoom.meeting_id
        let newmeetings = meetings.filter(item => item.date==req.query.date)
        getRoom.meeting_id=newmeetings
      }
      res.status(200).send(getRoom)
    } catch(e) {
      res.status(500).send(e.message)
    }
  }

  export async function  deleteRoomById(req, res){   
    try {
      console.log("yes")
      let result = await Room.remove(
        { _id: req.params.id})
      if (_.isNull(result))
        return res.status(404).send({success: false, message: 'Issue while deleting room', statusCode: 404})
      res.status(200).send({success: true, message: 'Successfully deleted room', statusCode: 200})
    } catch(e) {
      res.status(500).send(e)
    }
  }

  export async function getLeadRooms(req,res){
    try{
    let query = {}
    query['leadId'] = (ObjectId(req.params.id))
    if (!_.isUndefined(req.query.date)) {
      query['date']=Number(req.query.date)    
    }
    let result=await Meeting.aggregate([
      {$match:query},
      { "$lookup": {
        "from": 'rooms',
        "let": { "roomid": "$roomId" },
        "pipeline": [
          { $match: { $expr: { $eq: [ '$_id', '$$roomid'] } } },
          { $project: {
            meeting_id:0,
          }},
        ],
        
        "as": "roomDetails"
      }},
      { "$lookup": {
        "from": 'users',
        "let": { "leadid": "$leadId" },
        "pipeline": [
          { $match: { $expr: { $eq: [ '$_id', '$$leadid'] } } },
          { $project: {
            fullName:1,
            email:1,
            display_name:1
          }},
        ],
        
        "as": "leadDetails"
      }},
      { "$lookup": {
        "from": 'users',
        "let": { "users": "$users" },
        "pipeline": [
          { "$match": { "$expr": { "$in": [ "$_id", "$$users" ] } } },
          { $project: {
            fullName:1,
            email:1,
            display_name:1
          }},
        ],
        "as": "usersDetails"
      }},
    ])
    if (_.isNull(result))
        return res.status(404).send({success: false, message: `Meeting with id:  ${req.params.id} does not exist`, statusCode: 404})
    res.status(200).send({result:result,total:result.length})    
    } catch(err){
      res.status(500).send(err.message)
    }    
  }