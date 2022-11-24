import {Meeting,Room,User} from '../models/model'
import _, { rearg } from 'lodash'
import {ObjectId} from 'mongodb'
import nodeCron from 'node-cron'
const meetingFields=[
    'roomId',
    'leadId',
    'date',
    'from_time',
    'end_time',
    'meeting_desc',
    'users',
    'date',
    'status',
    'meeting_name'
]

export async function RequestMeeting(req,res){
    try{
        let pickedMeeting=_.pick(req.body,meetingFields)
        // let query={$and:[{from_time:{$lte:pickedMeeting.from_time}},{end_time:{$gte:pickedMeeting.end_time}}]}
        // console.log(pickedMeeting.from_time)
        // let result1=await Meeting.find(
        //     query
        // )
        // console.log(result1)
        let currentTime=Date.now()
        if(pickedMeeting.from_time<currentTime){
          res.status(404).send({success: false, message: `cannot create meeting for the past time periods`, statusCode: 404})
        }
        else{
          let newMeeting= new Meeting(pickedMeeting)
          let result=await newMeeting.save()
          if(!_.isUndefined(result)){
              // let updateRoomFields={
              //     room_lead:req.body.leadId,
              //     from_time:req.body.from_time,
              //     end_time:req.body.end_time,
              //     status: "occupied"
              // }
              let updatedRoom = await Room.findOneAndUpdate(
                  { _id: req.body.roomId },
                  {$push:{meeting_id:result._id}},
                  { new: true })
              if (!_.isNull(updatedRoom)){
                  res.status(200).send(result)
              }
          }
          else{
              res.status(404).send({success: false, message: `some issue in cretaing new meeting`, statusCode: 404})
          }
        }
        
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}

export async function joinMeeting(req, res){   
    try {
        let pickedMeeting = _.pick(req.body, meetingFields)
        let meetingID = req.params.id;
        let updateMeeting = await Meeting.findOneAndUpdate({_id:meetingID}, { $push: { users: pickedMeeting.users[0] } }, {new:true});
        if(_.isNull(updateMeeting))
            return res.status(404).send({success:false, message:`Meeting with ${meetingID} does not exist`, statusCode:404})
        res.status(200).json({
          msg:"User joined succesfully",
          data: updateMeeting
        })
    } catch(err) {
      res.status(500).send({message:err.message})
    }
  }

export async function checkRoom(req,res){
    try{
      let reqDate = req.query.date;
      let roomId = ObjectId(req.query.roomId);
      let start_date=parseInt(req.query.date);
      let end_date=parseInt(req.query.date)+86400000
      let result;
      if(!_.isEmpty(roomId && reqDate) || !_.isUndefined(roomId && reqDate)){
        result=await Meeting.aggregate([
          { $match:{ $and:[ { roomId, date:{ $gte:start_date,$lt:end_date },$or:[ { status:'ongoing' },{ status:'upcoming' } ] } ] } },
          {$project:{
            "from_time": 1,
            "end_time": 1,
            "meeting_desc": 1
          }},

        ]);
      }
      res.status(200).send(result)
    } catch(e){
      res.status(500).send(e.message)
    }
  }

export async function  getMeetingById(req, res){   
    try {
      let getMeeting = await Meeting.findById(req.params.id).populate({path:'roomId'}).populate([{ path: 'users' },{ path: 'leadId' }])
      if (_.isNull(getMeeting))
        return res.status(404).send({success: false, message: `Meeting with id:  ${req.params.id} does not exist`, statusCode: 404})
      res.status(200).send(getMeeting)
    } catch(e) {
      res.status(500).send(e.message)
    }
}  
  export async function handoverMeetingById(req,res){
    try{
      // let result=await Room.findOneAndUpdate(
      //   { _id: req.params.id},
      //   { $pull: { meeting_id: req.query.meetingId}},
      //   { new: true }
      // )
      // if (_.isNull(result))
      //   return res.status(404).send({success: false, message: `Room with id:  ${req.params.id} does not exist`, statusCode: 404})
      let result=await Meeting.findOneAndUpdate(
        { _id: req.params.id},
        {status:"completed"},
        { new: true }
      )
      if (_.isNull(result))
        return res.status(404).send({success: false, message: `meeting with id:  ${req.query.meetingId} does not exist`, statusCode: 404})
      res.status(200).send(result)
    } catch(e){
      res.status(500).send(e.message)
    }
  }

  
  // export async function automaticHandover(req,res){
  //   try{
  //     let currentTime=Date.now()
  //     console.log(currentTime)
  //     let query={from_time:currentTime}
  //     // console.log(query)
  //     let result=await Meeting.updateMany(
  //       query,
  //         { $set: { status: "ongoing" } },
  //     )
  //     res.status(200).send(result)
  //   } catch(err){
  //     res.status(500).send(err.message)
  //   }
  // }

  // const job = nodeCron.schedule("* * * * * ", function jobYouNeedToExecute() {
  //   // Do whatever you want in here. Send email, Make  database backup or download data.
  //   console.log("every minute");
  // });
  const job = nodeCron.schedule("* * * * * ", async function automaticHandover() {
    // cron job to change the status of meeting automatically.
    try{
      // let currentTime=Date.now()
      var currentTime = new Date(+new Date() - ((+new Date()) % 60000));
      let query={$and:[{status:"upcoming"},{from_time:currentTime}]}
      let query1={$and:[{status:"ongoing"},{end_time:currentTime}]}
      let result=await Meeting.updateMany(
        query,
          { $set: { status: "ongoing" } },
      )
      let result1=await Meeting.updateMany(
        query1,
          { $set: { status: "completed" } },
      )
      // console.log("every minute")
    } catch(err){
      res.status(500).send(err.message)
    }
  });
