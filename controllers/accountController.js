const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const accountModel = require('../models/account-model')
const utilities = require('../utilities/')
require('dotenv').config()

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
	let nav = await utilities.getNav()
	res.render('account/login', {
		title: 'Login',
		nav,
		errors: null
	})
}

/* ****************************************
 *  Deliver register view
 * *************************************** */
async function buildRegister(req, res, next) {
	let nav = await utilities.getNav()
	res.render('account/register', {
		title: 'Register',
		nav,
		errors: null
	})
}

/* ****************************************
 *  Deliver account management view
 * *************************************** */
async function buildAccountManagement(req, res, next) {
	let nav = await utilities.getNav()
	res.render('account/account-management', {
		title: 'Account Management',
		nav,
		errors: null
	})
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
	let nav = await utilities.getNav()
	const { account_firstname, account_lastname, account_email, account_password } = req.body

	// Hash the password before storing
	let hashedPassword
	try {
		// regular password and cost (salt is generated automatically)
		hashedPassword = await bcrypt.hashSync(account_password, 10)
	} catch (error) {
		req.flash('error', 'Sorry, there was an error processing the registration.')
		res.status(500).render('account/register', {
			title: 'Registration',
			nav,
			errors: null
		})
	}

	const regResult = await accountModel.registerAccount(
		account_firstname,
		account_lastname,
		account_email,
		hashedPassword
	)

	if (regResult) {
		req.flash('notice', `Congratulations, you\'re registered ${account_firstname}. Please log in.`)
		res.status(201).render('account/login', {
			title: 'Login',
			nav,
			errors: null
		})
	} else {
		req.flash('error', 'Sorry, the registration failed.')
		res.status(501).render('account/register', {
			title: 'Registration',
			nav,
			errors: null
		})
	}
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
	let nav = await utilities.getNav()
	const { account_email, account_password } = req.body
	const accountData = await accountModel.getAccountByEmail(account_email)
	if (!accountData) {
		req.flash('error', 'Please check your credentials and try again.')
		res.status(400).render('account/login', {
			title: 'Login',
			nav,
			errors: null,
			account_email
		})
		return
	}
	try {
		if (await bcrypt.compare(account_password, accountData.account_password)) {
			delete accountData.account_password
			const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
			if (process.env.NODE_ENV === 'development') {
				res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
			} else {
				res.cookie('jwt', accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
			}
			return res.redirect('/account/')
		} else {
			req.flash('message error', 'Please check your credentials and try again.')
			res.status(400).render('account/login', {
				title: 'Login',
				nav,
				errors: null,
				account_email
			})
		}
	} catch (error) {
		throw new Error('Access Forbidden')
	}
}

/* ****************************************
 *  Process logout request
 * *************************************** */
async function logout(req, res, next) {
	// Clear the JWT cookie to log out the user
	res.clearCookie('jwt')
	// Clear any session data
	res.locals.loggedin = 0
	delete res.locals.accountData
	// Flash success message and redirect to home
	req.flash('notice', 'You have been logged out successfully.')
	res.redirect('/')
}

/* ****************************************
 *  Build update account view
 * *************************************** */
async function buildUpdateAccount(req, res, next) {
	const account_id = parseInt(req.params.accountId)
	let nav = await utilities.getNav()

	// Verify the user can only update their own account
	if (account_id !== res.locals.accountData.account_id) {
		req.flash('error', 'You can only update your own account information.')
		return res.redirect('/account/')
	}

	// Get account data from model
	const accountData = await accountModel.getAccountById(account_id)
	if (!accountData) {
		req.flash('error', 'Account not found.')
		return res.redirect('/account/')
	}

	res.render('account/update-account', {
		title: 'Update Account Information',
		nav,
		errors: null,
		account_id: accountData.account_id,
		account_firstname: accountData.account_firstname,
		account_lastname: accountData.account_lastname,
		account_email: accountData.account_email
	})
}

/* ****************************************
 *  Process Account Info Update
 * *************************************** */
async function updateAccountInfo(req, res, next) {
	const { account_id, account_firstname, account_lastname, account_email } = req.body
	let nav = await utilities.getNav()

	try {
		// Update account core fields
		const updated = await accountModel.updateAccountInfo(
			account_id,
			account_firstname,
			account_lastname,
			account_email
		)

		if (updated) {
			// Re-query current account data for display
			const refreshed = await accountModel.getAccountById(account_id)
			// Update JWT if the logged in user updated their own info
			if (
				res.locals.loggedin &&
				res.locals.accountData &&
				res.locals.accountData.account_id === parseInt(account_id)
			) {
				const payload = { ...res.locals.accountData, ...refreshed }
				delete payload.account_password
				const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
				if (process.env.NODE_ENV === 'development') {
					res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
				} else {
					res.cookie('jwt', accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
				}
			}
			req.flash('notice', 'Account information updated successfully.')
			return res.redirect('/account/')
		} else {
			req.flash('error', 'Sorry, the account update failed.')
			return res.status(400).render('account/update-account', {
				title: 'Update Account Information',
				nav,
				errors: null,
				account_id,
				account_firstname,
				account_lastname,
				account_email
			})
		}
	} catch (error) {
		req.flash('error', 'An unexpected error occurred while updating your account.')
		return res.status(500).render('account/update-account', {
			title: 'Update Account Information',
			nav,
			errors: null,
			account_id,
			account_firstname,
			account_lastname,
			account_email
		})
	}
}

/* ****************************************
 *  Process Password Change
 * *************************************** */
async function updateAccountPassword(req, res, next) {
	const { account_id, account_password } = req.body
	let nav = await utilities.getNav()

	try {
		// Hash new password
		const hashed = await bcrypt.hash(account_password, 10)
		const result = await accountModel.updateAccountPassword(account_id, hashed)

		if (result) {
			req.flash('notice', 'Password updated successfully.')
			return res.redirect('/account/')
		} else {
			req.flash('error', 'Sorry, the password update failed.')
			// Get account data for sticky values
			const acct = await accountModel.getAccountById(account_id)
			return res.status(400).render('account/update-account', {
				title: 'Update Account Information',
				nav,
				errors: null,
				account_id,
				account_firstname: acct?.account_firstname,
				account_lastname: acct?.account_lastname,
				account_email: acct?.account_email
			})
		}
	} catch (error) {
		req.flash('error', 'An unexpected error occurred while changing your password.')
		const acct = await accountModel.getAccountById(account_id)
		return res.status(500).render('account/update-account', {
			title: 'Update Account Information',
			nav,
			errors: null,
			account_id,
			account_firstname: acct?.account_firstname,
			account_lastname: acct?.account_lastname,
			account_email: acct?.account_email
		})
	}
}

module.exports = {
	buildLogin,
	buildRegister,
	registerAccount,
	accountLogin,
	buildAccountManagement,
	logout,
	buildUpdateAccount,
	updateAccountInfo,
	updateAccountPassword
}
