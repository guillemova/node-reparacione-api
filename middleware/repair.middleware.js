const Repair = require("../models/repair.model")
const User = require("../models/user.model")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")

exports.validRepairById = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const repair = await Repair.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: {
            id,
            status: 'pending'
        },
        include: [
            {
                model: User,
                attributes: {
                    exclude: [
                        'createdAt',
                        'updatedAt',
                        'passwordChangeAt',
                        'password'
                    ]
                },
                where: {
                    status: 'available'
                }
            }
        ]
    })

    if (!repair) {
        return next(new AppError('Order not found', 400))
    }

    req.repair = repair
    next()
})