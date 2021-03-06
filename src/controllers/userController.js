import userService from '../services/userService';

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: "Missing input parameters"
        })
    }

    let userData = await userService.isExistUser(email, password);

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}
let handleGetAllUsers = async (req, res) => {
    let id = req.query.id;
    console.log(id)
    if (!id) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing required parameter (id)',
            users: {}
        })
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        message: 'Got all users successfully',
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    let data = req.body;
    // console.log('check newUser controller', data)
    let newUser = await userService.createNewUser(data);
    if (newUser.errCode !== 0) {
        return res.status(200).json({
            errCode: newUser.errCode,
            message: newUser.message,

        })
    }
    return res.status(200).json({
        errCode: newUser.errCode,
        message: newUser.message,
    })
}
let handleEditUser = async (req, res) => {

    let data = req.body;
    let checkAct = await userService.editUser(data);
    // console.log('check newUser controller',newUser)
    if (checkAct.errCode !== 0) {
        return res.status(500).json({
            errCode: checkAct.errCode,
            message: checkAct.message,

        })
    }
    return res.status(200).json({
        errCode: checkAct.errCode,
        message: checkAct.message,
    })
}

let handleDelUser = async (req, res) => {
    let userId = req.body.id;
    // console.log('---CHECK from controller: ', userId)
    let checkAct = await userService.deleteUser(userId);
    // console.log('check newUser controller',newUser)
    if (checkAct.errCode !== 0) {
        return res.status(200).json({
            errCode: checkAct.errCode,
            message: checkAct.message,

        })
    }
    return res.status(200).json({
        errCode: checkAct.errCode,
        message: checkAct.message,
    })
}

let handleGetAllCodes = async (req, res) => {
    // setTimeout(async () => {
    //     let checkAct = await userService.getAllCodes(req.query.type);
    //     if (checkAct.errCode === 0) {
    //         return res.status(200).json({
    //             errCode: checkAct.errCode,
    //             message: checkAct.message,
    //             data: checkAct.data
    //         })
    //     }
    // }, 2000)

    let checkAct = await userService.getAllCodes(req.query.type);
    if (checkAct.errCode === 0) {
        return res.status(200).json({
            errCode: checkAct.errCode,
            message: checkAct.message,
            data: checkAct.data
        })
    }
    return res.status(200).json({
        errCode: checkAct.errCode,
        message: checkAct.message,
        data: {}
    })
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDelUser: handleDelUser,

    handleGetAllCodes: handleGetAllCodes
}