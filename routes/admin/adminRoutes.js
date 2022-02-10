const {Router} = require('express')
const { GetRegister, getAdmin, GetLogin, GetPasswordReset, PostResetPassword, PostLogin, PostRegister, GetSuccess, GetLogout } = require('../../controllers/adminController')


const adminRoutes = Router()

adminRoutes.get('/admin', getAdmin)
adminRoutes.get('/admin/login', GetLogin)
adminRoutes.post('/admin/login', PostLogin)
adminRoutes.get('/admin/register', GetRegister)
adminRoutes.post('/admin/register', PostRegister)

adminRoutes.get('/admin/reset-password', GetPasswordReset)
adminRoutes.post('/admin/reset-password', PostResetPassword)

adminRoutes.get('/admin/success', GetSuccess)
adminRoutes.get('/admin/logout', GetLogout)



module.exports = adminRoutes