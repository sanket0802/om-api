import {getAllRooms,updateRoomById,createRoom, joinRoom, getRoomById,deleteRoomById,getLeadRooms,automaticHandover} from '../../services/room'

const routes=(app)=>{
    app
    .route(`${process.env.BASE_PATH}/rooms`)
    .get(getAllRooms)
    app
    .route(`${process.env.BASE_PATH}/rooms/:id`)
    .put(updateRoomById)
    app
    .route(`${process.env.BASE_PATH}/joinroom`)
    .post(joinRoom)
    app
    .route(`${process.env.BASE_PATH}/rooms`)
    .post(createRoom)
    app
    .route(`${process.env.BASE_PATH}/room/:id`)
    .get(getRoomById)
    app
    .route(`${process.env.BASE_PATH}/room/:id`)
    .delete(deleteRoomById)
    app
    .route(`${process.env.BASE_PATH}/room/lead/:id`)
    .get(getLeadRooms)
    // app
    // .route(`${process.env.BASE_PATH}/automatichandover`)
    // .get(automaticHandover)

}

export default routes