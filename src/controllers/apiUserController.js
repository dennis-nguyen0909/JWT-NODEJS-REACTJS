import userApiServices from '../services/userApiServices'
const handleReadUser = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let { page, limit } = req.query;
            let data = await userApiServices.getUserPagination(+page, +limit);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        } else {
            let data = await userApiServices.getAllUser();
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        }

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: "Error",
            EC: -1,
            DT: ""
        })
    }
}
const handleCreateUser = async (req, res) => {
    try {
        let data = await userApiServices.createUser(req.body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    } catch (error) {
        return res.status(200).json({
            EM: "Server is error",
            EC: 1,
            DT: ""
        })
    }
}
const handleUpdateUser = async (req, res) => {
    try {

        let data = await userApiServices.updateUser(req.body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: "Error from server",
            EC: data.EC,
            DT: ""
        })
    }
}
const handleRemoveUser = async (req, res) => {
    try {
        let data = await userApiServices.deleteUser(req.body.id);
        console.log(data);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Error from server',
            EC: -1,
            DT: ''
        })
    }
}
const getUserAccount = async (req, res) => {
    return res.status(200).json({
        EM: 'OK',
        EC: 0,
        DT: {
            access_token: req.token,
            groupWithRoles: req.user.groupWithRoles,
            email: req.user.email,
            username: req.user.username,
        }
    })
}


module.exports = { handleReadUser, handleCreateUser, handleUpdateUser, handleRemoveUser, getUserAccount };