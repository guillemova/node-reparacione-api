const Repair = require("../models/repair.model");
const User = require("../models/user.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.validUserById = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const user = await User.findOne({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'passwordChangeAt', 'password']
        },
        where: {
            id,
            status: 'available'
        }
    })

    if (!user) {
        return next(new AppError('User not found', 400))
    }

    req.user = user
    next()
})

exports.validIfExistUserEmail = catchAsync(async (req, res, next) => {
    const { email } = req.body

    const user = await User.findOne({
        where: {
            email: email.toLowerCase()
        }
    })

    console.log(user);

    if (user && !user.status) {
        return next(new AppError('the user already has an account, but it is deactivated, contact the administrator', 400))
    }

    if (user) {
        return next(new AppError('the email user already exists', 400))
    }

    next()
})