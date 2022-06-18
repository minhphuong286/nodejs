import userService from '../sevices/userService';

let handleLogin = async(req, res) => {
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
    let newUser = await userService.createNewUser(data);
    // console.log('check newUser controller',newUser)
    if (newUser.errCode !== 0) {
        return res.status(500).json({
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
    let checkAct = await userService.deleteUser(userId);
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
module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDelUser: handleDelUser
}