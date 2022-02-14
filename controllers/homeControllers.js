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

exports.getContact = (req, res) =>{
    res.render("home/contact")
    
}

exports.getSorts = (req, res, next) => {
    res.render('home/sorts', {
        csrfToken: req.csrfToken()
    })
}

exports.postSorts = (req, res) => {
    console.log(req.body);
    res.redirect('/roofs')
}

exports.postRoofInfo = (req, res) => {
    console.log(req.body.area)

    if (req.body.area === 0) {
         req.flash('error', "Märkera hela ditt")
         return res.redirect('/')
    }
    req.session.area = req.body.area
    res.redirect('/compass')
    
}

exports.getCompass = (req, res, next) => {
    res.render('home/compass')
}

exports.getDirection = (req, res) => {
    req.session.direction = req.params.id
    res.redirect('/angles')
}

exports.getAngles = (req, res) => {
    res.render('home/angles', {
        csrfToken: req.csrfToken()
    })
}

exports.postAngles = (req, res) => {
    console.log(req.body);
    res.redirect('/sorts')
}


exports.getInfo = (req, res) => {
    res.render('home/information', {
        csrfToken: req.csrfToken()
    })
}
exports.getRoofs = (req, res) => {
    res.render('home/roofs', {
        csrfToken: req.csrfToken()
    })
}

exports.postRoofs = (req, res) => {
    console.log(req.body);
    res.redirect('/houses')
}



exports.getHouses = (req, res) => {
    res.render('home/houses', {
        csrfToken: req.csrfToken()
    })
}

exports.postHouses = (req, res) => {
    console.log(req.body);
    res.redirect('/houses-options')
}

exports.getHouseOptions = (req, res) => {
    res.render('home/houseOptions', {
        csrfToken: req.csrfToken()
    })
}

exports.postHouseOptions = (req, res) => {
    console.log(req.body);
    res.redirect('/takinfo')
}


exports.getTakInfo = (req, res) => {
    res.render('home/takInfo', {
        csrfToken: req.csrfToken()
    })
}

exports.postTakInfo = (req, res) => {
    console.log(req.body);
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

exports.postFloor = (req, res) => {
    console.log(req.body);
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