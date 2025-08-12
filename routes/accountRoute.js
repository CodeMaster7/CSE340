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

// Route to build account management view (default route)
router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

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
	utilities.handleErrors(accountController.accountLogin)
)

// Route to process logout
router.get('/logout', utilities.handleErrors(accountController.logout))

// Route to build update account view
router.get('/update/:accountId', utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount))

// Favorites: list (Client only)
router.get('/favorites', utilities.checkClient, utilities.handleErrors(accountController.buildFavorites))

// Favorites: add (Client only)
router.post('/favorites/:invId', utilities.checkClient, utilities.handleErrors(accountController.addFavorite))

// Favorites: remove (Client only)
router.post('/favorites/:invId/delete', utilities.checkClient, utilities.handleErrors(accountController.removeFavorite))

// Route to process account info update
router.post(
	'/update',
	utilities.checkLogin,
	regValidate.updateAccountRules(),
	regValidate.checkUpdateAccountData,
	utilities.handleErrors(accountController.updateAccountInfo)
)

// Route to process password change
router.post(
	'/change-password',
	utilities.checkLogin,
	regValidate.changePasswordRules(),
	regValidate.checkChangePasswordData,
	utilities.handleErrors(accountController.updateAccountPassword)
)

module.exports = router
