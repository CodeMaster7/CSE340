// Needed Resources
const express = require('express')
const router = new express.Router()
const accountController = require('../controllers/accountController')
const utilities = require('../utilities/')
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get('/login', utilities.handleErrors(accountController.buildLogin))

// Route to build register view
router.get('/register', utilities.handleErrors(accountController.buildRegister))

// Route to process register form
router.post(
	'/register',
	regValidate.registationRules(),
	regValidate.checkRegData,
	utilities.handleErrors(accountController.registerAccount)
)

// Route to process login form
router.post(
	'/login',
	regValidate.loginRules(),
	regValidate.checkLoginData,
	utilities.handleErrors(accountController.loginAccount)
)

module.exports = router
