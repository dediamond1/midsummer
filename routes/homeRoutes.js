const { Router } = require('express')
const { GetHome, getSorts, postRoofInfo, getCompass, getDirection, getAngles, getInfo, getRoofs, getHouses, getHouseOptions, postHouseOptions, getProducts, postProducts, postHouses, postRoofs, postAngles, postSorts, getTakInfo, postTakInfo, getFloor, postFloor, getRenovate, postRenovate } = require('../controllers/homeControllers')

const homeRoutes = Router()

homeRoutes.get('/', GetHome)
homeRoutes.get('/sorts', getSorts)
homeRoutes.post('/sorts', postSorts)
homeRoutes.get('/compass', getCompass)
homeRoutes.get('/compass/:id', getDirection)
homeRoutes.get('/angles', getAngles)
homeRoutes.post('/angles', postAngles)
homeRoutes.get('/result', getInfo)
homeRoutes.get('/roofs', getRoofs)
homeRoutes.post('/roofs', postRoofs)
homeRoutes.get('/houses', getHouses)
homeRoutes.post('/houses', postHouses)
homeRoutes.get('/houses-options', getHouseOptions)
homeRoutes.post('/houses-options', postHouseOptions)
homeRoutes.get('/products', getProducts)
homeRoutes.post('/products', postProducts)
homeRoutes.post('/roof-info', postRoofInfo)
homeRoutes.get('/takinfo', getTakInfo)
homeRoutes.post('/takinfo', postTakInfo)
homeRoutes.get('/floor', getFloor)
homeRoutes.post('/floor', postFloor)
homeRoutes.get('/renovate', getRenovate)
homeRoutes.post('/renovate', postRenovate)



module.exports = homeRoutes