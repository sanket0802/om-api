import {RequestMeeting,joinMeeting,checkRoom,getMeetingById,handoverMeetingById} from '../../services/meeting'

const routes=(app)=>{
    app
    .route(`${process.env.BASE_PATH}/meeting`)
    .post(RequestMeeting)
    app
    .route(`${process.env.BASE_PATH}/meeting/:id`)
    .put(joinMeeting)
    app
    .route(`${process.env.BASE_PATH}/checkroom`)
    .get(checkRoom)
    app
    .route(`${process.env.BASE_PATH}/meeting/:id`)
    .get(getMeetingById)
    app
    .route(`${process.env.BASE_PATH}/meeting/handover/:id`)
    .put(handoverMeetingById)
}

export default routes