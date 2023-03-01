
const { Router } = require("express")
const { check } = require("express-validator")


const {
    findUsers,
    updateUser,
    deleteUser,
    findUser,
    updatePassword
} = require("../controllers/users.controller")
const { protect, protectAccountOwner } = require("../middleware/auth/auth.middleware")
const { validUserById } = require("../middleware/user.middleware")
const { validateFields } = require("../middleware/validateFild.middleware")



const router = Router()

router.get('/', findUsers)

router.get('/:id', validUserById, findUser)

router.use(protect)

router.patch('/:id', [
    check('name', 'name require').not().isEmpty(),
    check('email', 'email require').not().isEmpty(),
    check('email', 'email must be a correct format').isEmail(),
    validateFields,
    validUserById,
    protectAccountOwner
], updateUser)

router.patch('/password/:id', [
    check('currentPassword', 'The current password must be mandatory').not().isEmpty(),
    check('newPassword', 'The new password must be mandatory').not().isEmpty(),
    validateFields,
    validUserById,
    protectAccountOwner
], updatePassword)

router.delete('/:id', validUserById, protectAccountOwner, deleteUser)


module.exports = {
    userRouter: router
}