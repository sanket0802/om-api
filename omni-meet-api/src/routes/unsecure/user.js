import {getUserWithId,loginWithmobile,updateUserById} from '../../services/user'

const routes =(app)=>{
    app
    .route(`${process.env.BASE_PATH}/users/:userId`) 
    .get(getUserWithId)
    app
    .route(`${process.env.BASE_PATH}/users/:userId`) 
    .put(updateUserById)
    app
    .route(`${process.env.BASE_PATH}/users/login`)
    .post(loginWithmobile)
}

export default routes