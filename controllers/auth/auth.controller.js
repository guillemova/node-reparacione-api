const User = require("../../models/user.model");
const catchAsync = require("../../utils/catchAsync");
const bcrypt = require("bcryptjs");
const generateJWT = require("../../utils/jwt");
const AppError = require("../../utils/appError");

exports.createUser = catchAsync(async (req, res, next) => {

    const { name, email, password, role } = req.body

    const user = new User({ name, email, password, role });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const token = await generateJWT(user.id)

    res.status(201).json({
        status: 'success',
        message: 'The user was created successfully',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    //? 1. Verificar si existe el usuario y la contraseña son correctas
    const user = await User.findOne({
        where: {
            email: email.toLowerCase(),
            status: "available"
        }
    })

    if (!user) {
        return next(new AppError('The user could not be found', 404))
    }

    const verifPassword = await bcrypt.compare(password, user.password)

    if (!verifPassword) {
        return next(new AppError('Incorrect email or password', 401))
    }

    // ? 2. si todo esta bien, enviar token al cliente
    const token = await generateJWT(user.id)

    res.status(200).json({
        status: 'sucsess',
        message: 'usuario logiado con exito',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    })
})

exports.renewToken = catchAsync(async (req, res, next) => {
    const { id } = req.sessionUser

    const token = await generateJWT(id)

    const user = await User.findOne({
        attributes: ['id', 'username', 'email', 'role'],
        where: {
            status: true,
            id
        }
    })

    return res.status(200).json({
        status: 'sucsess',
        token,
        user
    })
})

// ! Casi siempre sera de este modo la creacion de usuario