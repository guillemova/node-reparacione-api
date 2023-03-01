// ? instanciamos el requerimiento a Router proveniente de express.
const { Router } = require("express")
const { check } = require("express-validator")

const {
    findRepairs,
    createRepairs,
    updateRepairs,
    deleteRepairs,
    findRepairById
} = require("../controllers/repairs.controller")
const { protect, protectAccountOwner, restrictTo } = require("../middleware/auth/auth.middleware")
const { validRepairById } = require("../middleware/repair.middleware")
const { validateFields } = require("../middleware/validateFild.middleware")


const router = Router()

router.post('/', [
    check('date', 'Date is Required').not().isEmpty(),
    check('motorsNumber', 'motorsNumber is Required').not().isEmpty(),
    check('description', 'description is Required').not().isEmpty(),
    validateFields
], createRepairs)

router.use(protect)


router.get('/',
    restrictTo('employee'),
    findRepairs
)

router.get('/:id',
    validRepairById,
    restrictTo('employee'),
    findRepairById
)

router.patch('/:id',
    validRepairById,
    restrictTo('employee'),
    updateRepairs
)

router.delete('/:id',
    validRepairById,
    restrictTo('employee'),
    deleteRepairs
)


module.exports = {
    repairsRouter: router
}