const Repair = require("../models/repair.model");
const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");

exports.findRepairs = catchAsync(async (req, res, next) => {

    const repair = await Repair.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: {
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

    res.status(200).json({
        status: "succses",
        message: "reparaciones obtenidas con exito",
        repair
    })
})

exports.findRepairById = catchAsync(async (req, res, next) => {
    const { repair } = req

    res.status(200).json({
        status: 'success',
        message: 'reparecion obtenida satisfactoriamente por el id',
        repair
    })
})


exports.createRepairs = catchAsync(async (req, res, next) => {
    const { date, userId, motorsNumber, description } = req.body

    const newRepair = await Repair.create({
        date,
        userId,
        motorsNumber,
        description
    })

    res.json({
        status: "succses",
        message: "reparacion creada con exito",
        newRepair
    })
})


exports.updateRepairs = catchAsync(async (req, res, next) => {
    const { repair } = req

    await repair.update({ status: 'complete' })

    res.json({
        status: "succses",
        message: "reparacion completada con exito"
    })
})


exports.deleteRepairs = catchAsync(async (req, res, next) => {
    const { repair } = req

    await repair.update({ status: 'cancelled' })

    res.json({
        status: "succses",
        message: "Reparacion cancelada con exito"
    })
})

