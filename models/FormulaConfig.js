const mongoose = require('mongoose')
const { Schema } = mongoose

const formulaConfig = new Schema({
    hourlyRates: {
        connectWindow: Number,
        connectChimney: Number,
        dressChimney: Number,
        connectVentilation: Number,
        assembleRoofLadder: Number,
        assembleChimneyPlatform: Number,
        assembleWalkway: Number,
        connectDormer: Number,
        connectEavesGutter: Number,

        baseTimeSmallRoof: Number,
        renovateSimpleSaddleroof: Number,
        waveRoofrenovationPerSqm: Number,
        waveRetrofittingPerSqm: Number,

        connectCarCharger: Number,
        installSlimPerSqm: Number,
        installWavePerSqm: Number,
        installBoldPerSqm: Number,

        electricityInstallationPerInverter: Number
    },
    timeFactors: {
        sadleRoof: Number,
        pentRoof: Number,
        hipRoof: Number,
        mansardRoof: Number
    },
    angleFactors: {
        28: Number,
        34: Number,
        40: Number,
        50: Number
    },
    energyProductions: {
        slim: Number,
        wave: Number,
        bold: Number,
    },
    areaLosses: {
        window: Number,
        chimney: Number,
        ventilation: Number,
        roofLadderWave: Number,
        roofLadderSlim: Number,
        chimneyPlatform: Number,
        roofWalkway: Number,
        dormer: Number,
        eavesGutter: Number
    },
    hourlyRates: {
        roofer: Number,
        electrician: Number
    },
    materialRates: {
        slimPerWatt: Number,
        wavePerWatt: Number,
        boldPerWatt: Number,
        tinRoofSlimPerSqm: Number,
        tiltedRoofWavePerSqm: Number,
        electricityEquipmentPerInverter: Number,
        electricityEquipmentPerKWWave: Number,
        scaffoldingPerSqm: Number,
    },
    huaweiInverterCosts: {
        2: Number,
        3: Number,
        4: Number,
        5: Number,
        6: Number,
        8: Number,
        10: Number,
        12: Number,
        15: Number,
        17: Number,
        20: Number
    },
    scaffoldingHeightPerFloor: Number,
    shippingRateWave: Number
}, {
    collection: 'formulaConfig',
    capped: {
        size: 8192,
        max: 1
    }
})

module.exports = mongoose.model('formulaConfig', formulaConfig)