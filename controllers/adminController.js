const User = require("../models/User");
const sendGrid = require('@sendgrid/mail')
const nodemailer = require('nodemailer')

// const emailTransporter = nodemailer.createTransport(sendGrid.setApiKey("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"))


const crypto = require('crypto')
const bcrypt = require('bcryptjs')
exports.getAdmin = (req, res) => {
    if (!req.session.isLogged) {
        return res.redirect('/admin/login')
    }
  res.render("admin/admin", {
    title: "Admin",
    
  });
};

exports.GetLogin =  async (req, res) => {
    if (req.session.isLogged) {
        return res.redirect('/admin')
    }
   
    res.render("admin/login", {
        title: "Login",
        error: req.flash('error'),
        csrfToken: req.csrfToken()
    });


}

exports.PostLogin = async (req, res, next) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})
        if (!user) {
            req.flash('error','invalid email or password')
            return res.redirect('/admin/login')
        }
        const hashedPassword = await bcrypt.compare(password, user.password)
        if (!hashedPassword) {
            req.flash('error','invalid email or password')
            return res.redirect('/admin/login')
        }
    
        req.session.isLogged = true
        res.redirect('/admin')
    

    } catch (error) {
        const err = new Error('Error login user',error )
        err.statusCode = 500
        next(err)
        
    }
}

exports.GetRegister = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0]
    }
    else {
        message = null
    }
    res.render("admin/register", {
        title: "Register",
        error: message,
        crfToken: req.csrfToken()
    });
};

exports.PostRegister = async (req, res, next) => {
  const { firstname, email, password, rpassword, lastname } = req.body;
  try {

    if (!firstname) {
        req.flash('error', "ange förnamn")
        return res.redirect('/admin/register')
    }
    if (!lastname) {
        req.flash('error', "ange efternamn")
        return res.redirect('/admin/register')
    }

    if (!password) {
        req.flash('error', "ange E-post")
        return res.redirect('/admin/register')
    }

    if (!rpassword) {
        req.flash('error', "Upprepa lösenord")
        return res.redirect('/admin/register')
    }

    if (password !== rpassword) {
      req.flash("error", "Passwords do not much");
      return res.redirect("/admin/register");
    }

    const user = await User.findOne({email})
    if (user) {
        req.flash('error', "there is alreay user with this email")
        return res.redirect('/admin/register')
    }

    const hashedPassword = await bcrypt.hash(password, 13)

    const newUser =  new User({
        firstname,
        lastname,
        email,
        password: hashedPassword,
    })

    // await emailTransporter.sendMail({
    //     to: email,
    //     from: "support@dejazmin.online",
    //     subject: "account created success",
    //     text: "thank you for joining us!",
    //     html: `
    //     <h2>click link down below to login your account</h2>

    //     <a href="http://localhost:4000/admin/login">Login</a>
        
    //     `
    // })

    await newUser.save()
    // req.flash("error", 'user created success')
    req.session.isLogged = true
    res.redirect('/admin/success')

  } catch (error) {
      const err = new Error('Error Occurd', error)
      err.statusCode = 500
      next(err)
  }
};


exports.GetPasswordReset = (req, res) => {
    res.render("admin/passwordReset", {
        title: "Password Reset",
        error: req.flash("error"),
        csrfToken: req.csrfToken()
    });
}


exports.PostResetPassword = async (req, res, next)=> {
    const {email} = req.body

    try {
        const user = await User.findOne({email})
        if (!user) {
            req.flash('error','No user with that email found!')
            return res.redirect('/admin/reset-password')
        }

        
        crypto.randomBytes(32, (error, buffer) => {
            if (error) {
                req.flash('error','Error Occurd')
                return res.redirect('/admin/reset-password') 
            }
            const token = buffer.toString("hex")
            const msg = {
                from: "noreplay@dejazmin.se",
                to: email,
                subject: "återställ lösenord",
                body: `
    
                <h3>You have requested reset password</h3>
                <p>please  <a href="localhost:400/admin/update-password/${token}">click here</a> to reset your password!</p>
                
                `
            }
             sendGrid.send(msg).then(() => {
                 res.redirect('/update')

             }).catch(err => console.log(err))
        })


    } catch (error) {
        const err = new Error('Error Occurd', error)
        err.statusCode = 500
        next(err)
    }
}

exports.GetSuccess = (req, res) => {
    let message = req.flash('success')
    if (message.length > 0) {
        message= message[0]
    }
    else{
        message = null
    }
    res.render("admin/success", {
        title: "success",
        error: message,
    });
}


exports.GetLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/admin/login')
    })
}