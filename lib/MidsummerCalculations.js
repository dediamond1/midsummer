class MidsummerOptions
{
    // ---[Midsummer Data]--- //

    // Time consumptions in hours
    static timeConsumptions = {
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
        installWavePerSqm          : 0.6,
        installBoldPerSqm          : 0,

        electricityInstallationPerInverter : 20
    }

    static timeFactors = {
        sadleRoof   : 1,    // Sadeltak
        pentRoof    : 1,    // Pulpettak
        hipRoof     : 1.2,  // Valmat tak
        mansardRoof : 1.5   // Mansardtak
    }

    static angleFactors = {
        28: 1,
        34: 1.2,
        40: 1.4,
        50: 1.5
    }

    // Production in kW/m2
    static energyProductions = {
        slim: 0.11,
        wave: 0.11,
        bold: 0.15
    }

    // Area losses in sqm(m2)
    static areaLosses = {
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

    static hourlyRates = {
        roofer      : 450,
        electrician : 600
    }

    static materialRates = {
        slimPerWatt : 0,
        wavePerWatt : 18.05283019,
        boldPerWatt : 0,
        tinRoofSlimPerSqm: 0,
        tiledRoofWavePerSqm: 0,
        electricityEquipmentPerInverter: 9239, 
        electricityEquipmentPerKWWave: 7845.283019,
        scaffoldingPerSqm: 182
    }

    static huaweiInverterCosts = {
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

    static scaffoldingHeightPerFloor = 3
    static shippingRateWave = 2500

    static VAT = 1.25
    static greenEnergyDeduction = 0.85
}

class MidsummerCalculations
{
    area = 0
    roofSegments = []
    direction = ''
    roofAngle = 0
    roofType = 'pentRoof'
    roofMaterial = ''
    windowCount = 0
    chimneys = 0
    chimneyPlatforms = 0
    ventilationCount = 0
    ladderCount = 0
    roofWalkways = 0
    dormers = 0
    floors = 0

    product = 'WAVE'

    constructor(userData = {})
    {
        this.area = userData.area
        this.roofSegments = userData.roofSegments
        this.direction = userData.direction
        this.roofAngle = userData.roofAngle
        this.roofType = 'pentRoof'
        this.roofMaterial = userData.roofMaterial
        this.windowCount = userData.windowCount
        this.chimneys = userData.chimneys
        this.ventilationCount = userData.ventilationCount
        this.ladderCount = userData.ladderCount
        this.chimneyPlatforms = userData.chimneyPlatforms
        this.roofWalkways = userData.roofWalkways
        this.dormers = userData.dormers
        this.floors = userData.floors
    }

    roofAreas = () => {
        return this.roofLengths.map((length, index) => {
            // Return the area of the roof portion
            return (length * this.roofHeight) / Math.cos(Radians(this.roofAngle || 0))
        })
    }

    totalRoofArea = () => {
        return this.roofAreas.reduce((a, b) => a + b, 0)
    } 

    shortestLengths = () => {
        return this.roofSegments.map((length, index) => {
            // Return the shortest length between ridge or "foot"
            return length >= this.roofSegments[index] ? this.roofSegments[index] : length
        })
    }

    solarPanelAreas = () => {
        /*
        return this.shortestLengths() .map((length, index) => {
            return (length * roofRidgeHeights[index]) / Math.cos(Radians(sunAngles[index]))
        })
        */
    }

    totalSolarPanelArea = () => {
        return this.area
        // this.solarPanelAreas.reduce((a, b) => a + b, 0)
    }

    getEffectiveAreaCovered = () => {
        var area = this.totalSolarPanelArea()
        area -= this.windowCount        * MidsummerOptions.areaLosses.window
        area -= this.chimneys           * MidsummerOptions.areaLosses.chimney
        area -= this.ventilationCount   * MidsummerOptions.areaLosses.ventilation
        area -= this.ladderCount        * MidsummerOptions.areaLosses.roofLadderWave
        area -= this.chimneyPlatforms   * MidsummerOptions.areaLosses.chimneyPlatform
        area -= this.roofWalkways       * MidsummerOptions.areaLosses.roofWalkway
        area -= this.dormers            * MidsummerOptions.areaLosses.dormer
        // area -= this.eavesGutters       * MidsummerOptions.areaLosses.eavesGutter
        return area
    }

    getEffect = () => {
        const multiplier = MidsummerOptions.energyProductions[this.product.toLowerCase()]
        const effectiveArea = this.getEffectiveAreaCovered()

        return effectiveArea * multiplier
    }

    getInverterCount = () => {
        var count = 1
        count += this.getEffect() > 20 ? 1 : 0
        count += this.roofSegments.length > 2 ? 1 : 0
        count += this.roofSegments.length > 4 ? 1 : 0

        return count
    }

    getInverterEffect = () => {
        return (this.getEffect()/this.getInverterCount()) * 0.8
    }

    getSolarPanelCost = () => {
        const watt = this.getEffect() * 1000
        const gross = watt * MidsummerOptions.materialRates[`${product.toLowerCase}PerWatt`]
        // Create moms + energiavdrags variabler
        return gross * MidsummerOptions.VAT * MidsummerOptions.greenEnergyDeduction
    }

    getMaterialCost = () => {
        const gross = this.getInverterCount() * MidsummerOptions.materialRates.electricityEquipmentPerInverter
        return gross * MidsummerOptions.VAT * MidsummerOptions.greenEnergyDeduction
    }

    getInverterCost = () => {
        const effect = this.getInverterEffect()
        var inverterCost
        for (var key in Object.keys(MidsummerOptions.huaweiInverterCosts)) {
            if (effect > key) continue
            inverterCost = MidsummerOptions.huaweiInverterCosts[key]
            break
        }
        const gross = this.getInverterCount() * inverterCost
        return gross * MidsummerOptions.VAT * MidsummerOptions.greenEnergyDeduction
    }

    /**
     * @deprecated Since we only request one angle from the customer
     * @returns string\number
     */
    getGreatestAngle = () => {
        return Math.max(...this.roofAngles)
    }

    getAngleFactor = () => {
        for (var key of Object.keys(MidsummerOptions.angleFactors)) {
            if (this.roofAngle > key) continue
            return MidsummerOptions.angleFactors[key]
        }
    }

    getWaveRetrofitCost = () => {
        const areaWithAngleFactor = this.getEffectiveAreaCovered() * this.getAngleFactor()
        const estimatedTime = areaWithAngleFactor * MidsummerOptions.timeConsumptions.installWavePerSqm
        const rooferCost = estimatedTime * MidsummerOptions.hourlyRates.roofer
        const gross = rooferCost * MidsummerOptions.timeFactors[this.roofType]

        return gross * MidsummerOptions.VAT * MidsummerOptions.greenEnergyDeduction
    }

    getElectricianCost = () => {
        const estimatedTime = this.getInverterCount() * MidsummerOptions.timeConsumptions.electricityInstallationPerInverter
        const gross = estimatedTime * MidsummerOptions.hourlyRates.electrician

        return gross * MidsummerOptions.VAT * MidsummerOptions.greenEnergyDeduction
    }

    getScaffoldingCost = () => {
        const scaffoldingHeight = this.floors * MidsummerOptions.scaffoldingHeightPerFloor 
        const scaffoldingSqm = scaffoldingHeight * this.shortestLengths()[0]
        const gross = scaffoldingSqm * MidsummerOptions.materialRates.scaffoldingPerSqm 

        return gross * MidsummerOptions.VAT
    }

    getTotalGrossCost = () => {
        return Math.round(
            this.getWaveRetrofitCost() +
            this.getElectricianCost() +
            this.getScaffoldingCost() +
            this.getInverterCost()
        )
    }

    getTotalNetCost = () => {
        return Math.round(this.getTotalGrossCost() * MidsummerOptions.VAT)
    }

    getGreenEnergyDeduction = () => {
        return Math.round(this.getTotalNetCost() - (this.getTotalNetCost() * MidsummerOptions.greenEnergyDeduction))
    }

    getShipping = () => {
        return MidsummerOptions.shippingRateWave * MidsummerOptions.VAT
    }

    getGrandTotal = () => {
        return Math.round(this.getTotalNetCost() + this.getShipping())
    }
}

module.exports = MidsummerCalculations