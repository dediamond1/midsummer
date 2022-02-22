/**
 * Convert degrees to radians
 * 
 * @param {number} degrees Contain a number representing the angle in degrees
 * @returns {number}
 */
const Radians = (degrees = 0) => {
    return degrees * Math.PI / 180
}

// ---[Midsummer Data]--- //

// Time consumptions in hours
const timeConsumptions = {
    connectWindow              : 12,
    connectChimney             : 8,
    dressChimney               : 12,
    connectVentilation         : 10,
    assembleRoofLadder         : 4,
    assembleChimneyPlatform    : 8,
    assembleWalkway            : 8,
    connectDormer              : 12,
    connectEavesGutter         : 8,

    baseTimeSmallRoof          : 40,
    renovateSimpleSaddleroof   : 1.6,
    waveRoofrenovationPerSqm   : 1,
    waveRetrofittingPerSqm     : 0.6,

    connectCarCharger          : 8,
    installSlimPerSqm          : 0,
    installWavePerSqm          : 0,
    installBoldPerSqm          : 0,

    electricityInstallationPerInverter : 20
}

const timeFactors = {
    sadleRoof   : 1,    // Sadeltak
    pentRoof    : 1,    // Pulpettak
    hipRoof     : 1.2,  // Valmat tak
    mansardRoof : 1.5   // Mansardtak
}

const angleFactors = {
    28: 1,
    34: 1.2,
    40: 1.4,
    50: 1.5
}

// Production in kW/m2
const energyProductions = {
    slim: 0.11,
    wave: 0.11,
    bold: 0.15
}

// Area losses in sqm(m2)
const areaLosses = {
    window            : 4.9,
    chimney           : 2.8,
    ventilation       : 1.3,
    roofLadderWave    : 0,
    roofLadderSlim    : 2.1,
    chimneyPlatform   : 7.2,
    roofWalkway       : 3.8,
    dormer            : 17.2,
    eavesGutter       : 2.8
}

const hourlyRates = {
    roofer      : 450,
    electrician : 600
}

const materialRates = {
    slimPerWatt : 0,
    wavePerWatt : 18.05283019,
    boldPerWatt : 0,
    tinRoofSlimPerSqm: 0,
    tiledRoofWavePerSqm: 0,
    electricityEquipmentPerInverter: 9239, 
    electricityEquipmentPerKWWave: 7845.283019,
    scaffoldingPerSqm: 182
}

const huaweiInverterCosts = {
    2:      11739,
    3:      11428,
    4:      11657,
    5:      12326,
    6:      14097,
    8:      16732,
    10:     18785,
    12:     19736.4,
    15:     22338.9,
    17:     22822,
    20:     24107.4
}

const scaffoldingHeightPerFloor = 3
const shippingRateWave = 2500

// ---[ USER DATA ]--- //

const roofLengths = [10, 8, 4, 10]
const roofRidgeLengths = [10, 0, 0, 10]
const roofHeight = 20
const roofAngles = [30, 10, 30, 10]
const roofRidgeHeights = []
const roofType = ''
const sunAngles = []
const windowCount = 0
const chimneyCount = 0
const chimneyPlatforms = 0
const ventilationCount = 0
const ladderCountSlim = 0
const ladderCountWave = 0
const roofWalkways = 0
const dormers = 0
const eavesGutters = 0
const floorCount = 0

// SLIM | WAVE | BOLD 
const product = 'WAVE'

const roofAreas = roofLengths.map((length, index) => {
    // Return the area of the roof portion
    return (length*roofHeight)/Math.cos(Radians(roofAngles[index] || 0))
})

const totalRoofArea = roofAreas.reduce((a, b) => a + b, 0)

const shortestLengths = roofRidgeLengths.map((length, index) => {
    // Return the shortest length between ridge or "foot"
    return length >= roofLengths[index] ? roofLengths[index] : length
})

const solarPanelAreas = shortestLengths.map((length, index) => {
    return (length * roofRidgeHeights[index]) / Math.cos(Radians(sunAngles[index]))
})

const totalSolarPanelArea = solarPanelAreas.reduce((a, b) => a + b, 0)

const getEffectiveAreaCovered = () => {
    var area = totalSolarPanelArea
    area -= windowCount * areaLosses.window
    area -= chimneyCount * areaLosses.chimney
    area -= ventilationCount * areaLosses.ventilation
    area -= ladderCountSlim * areaLosses.roofLadderSlim
    area -= ladderCountWave * areaLosses.roofLadderWave
    area -= chimneyPlatforms * areaLosses.chimneyPlatform
    area -= roofWalkways * areaLosses.roofWalkway
    area -= dormers * areaLosses.dormer
    area -= eavesGutters * areaLosses.eavesGutter
    return area
}

const getEffect = () => {
    const multiplier = energyProductions[product.toLowerCase]
    const effectiveArea = getEffectiveAreaCovered()
    return effectiveArea * multiplier
}

const getInverterCount = () => {
    var count = 1
    count += getEffect() > 20 ? 1 : 0
    count += roofLengths.length > 2 ? 1 : 0
    count += roofLengths.length > 4 ? 1 : 0
}

const getInverterEffect = () => {
    return (getEffect/getInverterCount) * 0.8
}

const getSolarPanelCost = () => {
    const watt = getEffect() * 1000
    const gross = watt * materialRates[`${product.toLowerCase}PerWatt`]
    // Create moms + energiavdrags variabler
    return gross * 1.25 * 0.85
}

const getMaterialCost = () => {
    const gross = getInverterCount() * materialRates.electricityEquipmentPerInverter
    return gross * 1.25 * 0.85
}

const getInverterCost = () => {
    const effect = getInverterEffect()
    var inverterCost
    for (var key in Object.keys(huaweiInverterCosts)) {
        if (effect > key) continue
        inverterCost = huaweiInverterCosts[key]
        break
    }
    const gross = getInverterCount() * inverterCost
    return gross * 1.25 * 0.85
}

/**
 * @deprecated Since we only request one angle from the customer
 * @returns string\number
 */
const getGreatestAngle = () => {
    return Math.max(...roofAngles)
}

const getAngleFactor = () => {
    for (var key in Object.keys(angleFactors)) {
        if (getGreatestAngle() > key) continue
        return angleFactors[key]
    }
}

const getWaveRetrofitCost = () => {
    const areaWithAngleFactor = getEffectiveAreaCovered() * getAngleFactor()
    const estimatedTime = areaWithAngleFactor * timeConsumptions.installWavePerSqm
    const rooferCost = estimatedTime * hourlyRates.roofer

    const gross = rooferCost * timeFactors[roofType]

    return gross * 1.25 * 0.85
}

const getElectricianCost = () => {
    const estimatedTime = getInverterCount() * timeConsumptions.electricityInstallationPerInverter
    const gross = estimatedTime * hourlyRates.electrician

    return gross * 1.25 * 0.85
}

const getScaffoldingCost = () => {
    const scaffoldingHeight = floorCount * scaffoldingHeightPerFloor 
    const scaffoldingSqm = scaffoldingHeight * shortestLengths[0] 
    const gross = scaffoldingSqm * materialRates.scaffoldingPerSqm 

    return gross * 1.25 * 0.85
}

const getShipping = () => {
    return shippingRateWave * 1.25
}

