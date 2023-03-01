const User = require("../models/user.model")
const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const Repair = require("../models/repair.model");

// ? Funcoin para Realizar una peticion GET
exports.findUsers = catchAsync(async (req, res, next) => {

    const users = await User.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'passwordChangeAt', 'password']
        },
        where: {
            status: 'available'
        }
    })

    res.json({
        status: "succses",
        message: "Users successfully found",
        users
    })
})

exports.findUser = catchAsync(async (req, res, next) => {
    const { user } = req

    res.status(200).json({
        status: 'success',
        message: 'User successfully obtained by his id',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            repairs: user.repairs
        }
    })
})

exports.updateUser = catchAsync(async (req, res, next) => {
    const { user } = req

    const { name, email } = req.body

    const updateUser = await user.update({
        name,
        email
    })

    res.status(200).json({
        status: "succses",
        message: "User updated successfully",
        updateUser
    })
})

exports.updatePassword = catchAsync(async (req, res, next) => {
    const { user } = req
    const { currentPassword, newPassword } = req.body

   
    const verifPassword = await bcrypt.compare(currentPassword, user.password)

    if (!verifPassword) {
        return next(new AppError('Incorrect password', 401))
    }

    if (currentPassword === newPassword) {
        return next(new AppError('the current password cannot be the same as the new password', 401))
    }

    const salt = await bcrypt.genSalt(10);
    const encriptedPassword = await bcrypt.hash(newPassword, salt);

    await user.update({
        password: encriptedPassword,
        passwordChangeAt: new Date()
    })

    res.status(200).json({
        status: 'sucsess',
        message: 'The user password wa updated successfully'
    })

})


exports.deleteUser = catchAsync(async (req, res, next) => {
    const { user } = req

    await user.update({ status: "disable" })

    res.status(200).json({
        status: "succses",
        message: "The user status has changed to disable",
    })
})

