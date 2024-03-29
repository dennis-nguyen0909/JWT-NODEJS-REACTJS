import db from '../models/index.js'
import { Op } from 'sequelize';
import userServices from '../services/userServices.js'
import bcrypt from 'bcryptjs'
import { getGroupWithRole } from '../services/JWTservices.js'
import { createJWT } from '../middleware/JWTcookie.js'
require('dotenv').config()
let checkEmailExist = async (userEmail) => {
    let user = await db.User.findOne({
        where: { email: userEmail }
    })
    if (user) {
        return true;
    }
    return false;
}
let checkPasswordExist = async (userPassword) => {
    let user = await db.User.findOne({
        where: { password: userPassword }
    })
    if (user) {
        return true;
    }
    return false;
}
let checkPhoneExist = async (userPhone) => {
    let user = await db.User.findOne({
        where: { phone: userPhone }
    })
    if (user) {
        return true;
    }
    return false;
}
const registerNewUser = async (rawUserData) => {
    try {
        // check email/phone number are exist
        // Do req.body gửi qua từ apiController là 1 object chứa email,phone....=> rawUserData.email==req.body.email
        let isEmailExist = await checkEmailExist(rawUserData.email);
        if (isEmailExist === true) {
            return {
                EM: 'The email is already exist!',
                EC: 1,
                DT: rawUserData.email
            }
        }
        let isPhoneExist = await checkPhoneExist(rawUserData.phone);
        if (isPhoneExist === true) {
            return {
                EM: 'The phone number is already exist!',
                EC: 2,
                DT: rawUserData.phone,
            }
        }
        // hash user password
        let hashPassword = await userServices.hashUserPassword(rawUserData.password);
        // create new user
        await db.User.create({
            email: rawUserData.email,
            username: rawUserData.username,
            password: hashPassword,
            phone: rawUserData.phone,
            groupId: 6
        })
        return {

            EM: "User created successfully!",
            EC: 0
        }
    } catch (error) {
        console.log("Error", error);
        return {
            EM: "Wrongs in services....",
            EC: 1
        }
    }
}
let checkHashPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword);
}
const loginUser = async (userData) => {
    try {
        let user = await db.User.findOne({
            where: {
                [Op.or]: [
                    { email: userData.valueLogin },
                    { phone: userData.valueLogin }
                ]
            }
        })
        if (user) {
            let isCorrectPassword = checkHashPassword(userData.password, user.password);
            if (isCorrectPassword === true) {
                let groupWithRoles = await getGroupWithRole(user);
                let payload = {
                    email: userData.email,
                    username: user.username,
                    groupWithRoles,
                }
                let token = createJWT(payload);

                return {
                    EM: "Login success!",
                    EC: 0,
                    DT: {
                        access_token: token,
                        groupWithRoles,
                        email: user.email,
                        username: user.username,
                    }
                }
            }
        }
        return {
            EM: "Your email or password is incorrect!!",
            EC: 1,
            DT: ""
        }


    } catch (error) {
        console.log("Error", error);
        return {
            EM: "Wrongs in services....",
            EC: 1
        }
    }
}


module.exports = {
    registerNewUser, loginUser, checkEmailExist, checkPasswordExist, checkPhoneExist, checkHashPassword
}