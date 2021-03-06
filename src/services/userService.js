import db from '../models/index';
import bcrypt from 'bcrypt';
const salt = bcrypt.genSaltSync(10);

import ld from 'lodash';

let isExistUser = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email);

            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'password', 'roleId', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                });
                if (user) {
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
                where: { email: userEmail }
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
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'All') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'All') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users);
        } catch (e) {
            reject(e)
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === false) {
                // console.log('>>>>>>>>Data prepare for create: ', data)
                let hashPasswordByBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordByBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phoneNb,
                    gender: data.gender,
                    roleId: data.role,
                    positionId: data.position,
                    image: data.avatar
                })
                resolve({
                    errCode: 0,
                    message: 'Created new user successfully'
                })
            } else {
                resolve({
                    errCode: 1,
                    message: 'User is existed'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (e) {
            reject(e)
        }
    })
}

let editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (!user) {
                resolve({
                    errCode: 1,
                    message: 'User is not exist'
                })
            } else {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phonenumber = data.phonenumber;
                user.gender = data.gender;
                user.positionId = data.positionId;
                user.roleId = data.roleId;
                if (data.avatar) {
                    user.image = data.avatar;
                }
                await user.save();

                resolve({
                    errCode: 0,
                    message: 'Edited user successfully'
                })
            }



        } catch (e) {
            reject(e)
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            //console.log('check from serve: ', userId)
            let user = await db.User.findOne({
                where: { id: userId }
            })
            if (user) {
                // console.log(user)
                await db.User.destroy({
                    where: { id: userId }
                });
                resolve({
                    errCode: 0,
                    message: 'Deleted user successfully'
                })
            }
            resolve({
                errCode: 1,
                message: 'User is not exist'
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getAllCodes = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('typeInput: ', typeInput)
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    message: 'Missing input parameters'
                })
            } else {
                let allcodes = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                // console.log('data from service', allcodes)
                if (ld.isEmpty(allcodes)) {
                    resolve({
                        errCode: 2,
                        message: 'type is invalid'
                    })
                } else {
                    resolve({
                        errCode: 0,
                        message: 'Got allcodes successfully',
                        data: allcodes
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    isExistUser: isExistUser,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    editUser: editUser,
    deleteUser: deleteUser,

    getAllCodes: getAllCodes,

}