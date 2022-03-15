const express = require('express')
const router = express.Router() 
const userController = require('./controllers/userController')
const reportController = require('./controllers/reportController')

//user and admin related routes
router.get('/',userController.home)
router.post('/auth',userController.auth)
// router.get('/wordtopdf',userController.wordtopdf)
router.get('/renderAdminLandingPage',userController.renderAdminLandingPage)
router.get('/renderApplicationPage',userController.renderApplicationPage)
router.get('/getReportPDF',userController.getReportPDF)
router.get('/deleteData/:id',userController.deleteData)
router.get('/update/:id',userController.updateData)
router.post('/update/:id',userController.postData)
router.get('/addUser', userController.addUser)
router.get('/addNewUserToDb',userController.addNewUserToDb)
router.get('/users',userController.users)
router.get('/deleteUser/:id',userController.deleteUser)
router.get('/logout', userController.logout)

// router.get('/forgotPassword',userController.forgotPassword)
// // router.get('/reset/:token',userController.reset)
// router.post('/reset/',userController.postReset)
// router.get('/setPassword',userController.setPassword)
 
//report related routes

// router.get('/freetrial',reportController.freetrial)
router.post('/word/pdf/generate',reportController.pdfgenerator)
router.get('/previousReports',reportController.previousReports)





module.exports = router