const { Router } = require('express')
const { body, validationResult } = require('express-validator')
const homeControllers = require('../controllers/homeControllers')

const errorHandler = (req, res, next) => {
    const errors = validationResult(req)

    if (errors.isEmpty()) return next()

    return res.status(400).json({ errors: errors.array() })
}

const homeRoutes = Router()

homeRoutes.get('/', homeControllers.GetHome)
homeRoutes.get('/sorts', homeControllers.getSorts)
homeRoutes.get('/compass', homeControllers.getCompass)
homeRoutes.get('/compass/:id', homeControllers.getDirection)
homeRoutes.get('/angles', homeControllers.getAngles)
homeRoutes.get('/result', homeControllers.getInfo)
homeRoutes.get('/roofs', homeControllers.getRoofs)
homeRoutes.get('/houses', homeControllers.getHouses)
homeRoutes.get('/houses-options', homeControllers.getHouseOptions)
homeRoutes.get('/products', homeControllers.getProducts)
homeRoutes.get('/takinfo', homeControllers.getTakInfo)
homeRoutes.get('/floor', homeControllers.getFloor)
homeRoutes.get('/renovate', homeControllers.getRenovate)

homeRoutes.post('/sorts', homeControllers.postSorts)
homeRoutes.post('/roofs', homeControllers.postRoofs)
homeRoutes.post('/houses', homeControllers.postHouses)
homeRoutes.post('/houses-options', homeControllers.postHouseOptions)
homeRoutes.post('/products', homeControllers.postProducts)
homeRoutes.post('/roof-info', homeControllers.postRoofInfo)
homeRoutes.post('/takinfo', homeControllers.postTakInfo)
homeRoutes.post(
    '/floor',
    body('floor').isInt({min: 1, max: 100}).toInt(),
    errorHandler,
    homeControllers.postFloor
)
homeRoutes.post(
    '/angles',
    body('angle').isInt({min: 28, max: 50}).toInt(),
    errorHandler,
    homeControllers.postAngles
)
homeRoutes.post('/renovate', homeControllers.postRenovate)



module.exports = homeRoutes