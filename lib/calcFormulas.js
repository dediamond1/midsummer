/**
 * Convert degrees to radians
 * 
 * @param {number} degrees Contain a number representing the angle in degrees
 * @returns {number}
 */
const Radians = (degrees = 0) => {
    return degrees * Math.PI / 180
}

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