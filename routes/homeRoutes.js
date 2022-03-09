const { Router } = require('express')
const { body, param, validationResult } = require('express-validator')
const homeControllers = require('../controllers/homeControllers')

const errorHandler = (req, res, next) => {
    const errors = validationResult(req)

    if (errors.isEmpty()) return next()

    return res.status(400).json({ errors: errors.array() })
}

const homeRoutes = Router()

//** GET Routes **//
homeRoutes.get('/', homeControllers.GetHome)
homeRoutes.get('/roof-type', homeControllers.getSorts)
homeRoutes.get('/compass', homeControllers.getCompass)
homeRoutes.get(
    '/compass/:direction',
    param('direction').isIn(['n', 'no', 'o', 'v', 'nv', 'so', 'sv', 's']),
    errorHandler,
    homeControllers.getDirection
)
homeRoutes.get('/angles', homeControllers.getAngles)
homeRoutes.get('/result', homeControllers.getResult)
homeRoutes.get('/roof-material', homeControllers.getRoofMaterial)
homeRoutes.get('/house-shape', homeControllers.getHouses)
homeRoutes.get('/house-options', homeControllers.getHouseOptions)
homeRoutes.get('/products', homeControllers.getProducts)
homeRoutes.get('/takinfo', homeControllers.getTakInfo)
homeRoutes.get('/floor', homeControllers.getFloor)
homeRoutes.get('/renovate', homeControllers.getRenovate)

//** POST Routes **//
homeRoutes.post(
    '/roof-area',
    body('area').isInt({min: 1}).toInt(),
    errorHandler,
    homeControllers.postRoofArea
)
homeRoutes.post(
    '/roof-type',
    body('type').isIn(['sadleRoof','pentRoof','hipRoof', 'mansardRoof']),
    errorHandler,
    homeControllers.postRoofType
)
homeRoutes.post(
    '/roof-material',
    body('material').notEmpty(),
    errorHandler,
    homeControllers.postRoofMaterial
)

homeRoutes.post(
    '/house-options',
    body('windowCount').isInt({min: 0, max: 100}).toInt(),
    body('chimneys').isInt({min: 0, max: 100}).toInt(),
    body('ventilationCount').isInt({min: 0, max: 100}).toInt(),
    body('ladderCount').isInt({min: 0, max: 100}).toInt(),
    body('chimneyPlatforms').isInt({min: 0, max: 100}).toInt(),
    body('roofWalkways').isInt({min: 0, max: 100}).toInt(),
    body('dormers').isInt({min: 0, max: 100}).toInt(),
    errorHandler,
    homeControllers.postHouseOptions
)
/**
 * For now we're only using wave
 */
homeRoutes.post(
    '/products',
    body('product').isIn(['BOLD', 'SLIM', 'WAVE']),
    errorHandler,
    homeControllers.postProducts
)
homeRoutes.post('/takinfo', homeControllers.postTakInfo)
homeRoutes.post(
    '/floors',
    body('floors').isInt({min: 1, max: 100}).toInt(),
    errorHandler,
    homeControllers.postFloors
)
homeRoutes.post(
    '/roof-angle',
    body('angle').isInt({min: 28, max: 50}).toInt(),
    errorHandler,
    homeControllers.postRoofAngle
)
homeRoutes.post('/renovate', homeControllers.postRenovate)

/**
 * @deprecated Not used since we're only selecting the area
 */
 homeRoutes.post(
    '/house-shape',
    homeControllers.postHouseShape
)

module.exports = homeRoutes