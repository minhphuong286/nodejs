import db from '../models/index';
import bcrypt from 'bcrypt';


let handleExistUser = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email);

            if (isExist) {
                let user = await db.User.findOne({
                    attributes:['email', 'password', 'roleId'],
                    where: { email: email },
                    raw: true
                });
                if(user){
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = `Infor's user is valid`;
                        delete user.password;
                        userData.user = user;
                        
                    } else {
                        userData.errCode = 2;
                        userData.errMessage = `Your password is not correct`;
                    }
                } else {
                    userData.errCode = 3;// user has just been removed
                    userData.errMessage = `Your email is not exist`; 
                }
                
                // resolve()
            } else {
                userData.errCode = 1;
                userData.errMessage = `Your email is not exist`;
            }
            resolve(userData);
        } catch (e) {
            reject(e)
        }
    })

}
let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {email: userEmail}
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}
let checkUserInfor = (userEmail, userPass) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await bd.User.findOne({
                where: {
                    email: userEmail,
                }
            })
            if (user) {

                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    handleExistUser: handleExistUser,

}