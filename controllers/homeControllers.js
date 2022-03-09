const { validationResult } = require('express-validator');

exports.GetHome = (req, res) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0]
    }
    else {
        message = null
    }
    res.render('home', {
        crfToken: req.csrfToken(),
        err: message
    })
}

exports.getSorts = (req, res, next) => {
    res.render('home/sorts', {
        csrfToken: req.csrfToken()
    })
}

exports.getDirection = (req, res) => {
    req.session.form.direction = req.params.direction
    console.log(req.session.form)
    res.redirect('/angles')     
}

exports.postRoofType = (req, res) => {
    req.session.form.roofType = req.body.type
    console.log(req.session.form)
    res.redirect('/roof-material')
}

exports.postRoofArea = (req, res) => {
    if (req.body.area === 0) {
         req.flash('error', "Markera hela ditt tak")
         return res.redirect('/')
    }
    req.session.form.area = req.body.area
    console.log(req.session.form)
    res.redirect('/compass')
    
}

exports.getCompass = (req, res, next) => {
    res.render('home/compass')
}

exports.getAngles = (req, res) => {
    res.render('home/angles', {
        csrfToken: req.csrfToken(),
        angles: [
            {
                label: "Under 29",
                value: 28
            },
            {
                label: "30-34",
                value: 34
            },
            {
                label: "35-40",
                value: 40
            },
            {
                label: "Över 40",
                value: 50
            }
        ]
    })
}

exports.postRoofAngle = (req, res) => {
    req.session.form.roofAngle = req.body.angle
    console.log(req.session.form)
    res.redirect('/roof-type')
}


exports.getResult = (req, res) => {
    res.render('home/information', {
        csrfToken: req.csrfToken()
    })
}
exports.getRoofMaterial = (req, res) => {
    res.render('home/roofs', {
        csrfToken: req.csrfToken()
    })
}

exports.postRoofMaterial = (req, res) => {
    req.session.form.roofMaterial = req.body.material
    console.log(req.session.form)
    res.redirect('/house-shape')
}



exports.getHouses = (req, res) => {
    res.render('home/houses', {
        csrfToken: req.csrfToken()
    })
}

exports.getHouseOptions = (req, res) => {
    res.render('home/houseOptions', {
        csrfToken: req.csrfToken()
    })
}

exports.postHouseOptions = (req, res) => {
    const {
        windowCount,
        chimneys,
        ventilationCount,
        ladderCount,
        chimneyPlatforms,
        roofWalkways,
        dormers
    } = req.body

    req.session.form = {
        ...req.session.form,
        windowCount,
        chimneys,
        ventilationCount,
        ladderCount,
        chimneyPlatforms,
        roofWalkways,
        dormers
    }

    console.log(req.session)
    res.redirect('/takinfo')
}


exports.getTakInfo = (req, res) => {
    res.render('home/takInfo', {
        csrfToken: req.csrfToken()
    })
}

exports.postTakInfo = (req, res) => {
    console.log('-- TAK INFO TBD --');
    res.redirect('/floor')
}



exports.getProducts = (req, res) => {
    res.render('home/products', {
        csrfToken: req.csrfToken()
    })
}

exports.postProducts = (req, res) => {
    console.log(req.body);
    res.redirect('/renovate')
}


exports.getFloor = (req, res) => {
    res.render('home/floor', {
        csrfToken: req.csrfToken()
    })
}

exports.postFloors = (req, res) => {
    req.session.form.floors = req.body.floors
    console.log(req.session.form)
    res.redirect('/products')
}


exports.getRenovate = (req, res) => {
    res.render('home/renovate', {
        csrfToken: req.csrfToken()
    })
}

exports.postRenovate = (req, res) => {
    console.log(req.body);
    res.redirect('/result')
}

/**
 * @deprecated House shape irrelevant due to user selecting area.
 */
exports.postHouseShape = (req, res) => {
    req.session.form.houseShape = req.body.shape
    console.log(req.session.form);
    res.redirect('/house-options')
}