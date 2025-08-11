const { body, validationResult } = require('express-validator')
const utilities = require('.')
const accountModel = require('../models/account-model')

const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
	return [
		// firstname is required and must be string
		body('account_firstname')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 1 })
			.withMessage('Please provide a first name.'), // on error this message is sent.

		// lastname is required and must be string
		body('account_lastname')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 2 })
			.withMessage('Please provide a last name.'), // on error this message is sent.

		// valid email is required and cannot already exist in the DB
		body('account_email')
			.trim()
			.escape()
			.notEmpty()
			.isEmail()
			.normalizeEmail() // refer to validator.js docs
			.withMessage('A valid email is required.'),

		// valid email is required and cannot already exist in the database
		body('account_email')
			.trim()
			.isEmail()
			.normalizeEmail() // refer to validator.js docs
			.withMessage('A valid email is required.')
			.custom(async (account_email) => {
				const emailExists = await accountModel.checkExistingEmail(account_email)
				if (emailExists) {
					throw new Error('Email exists. Please log in or use different email')
				}
			}),

		// password is required and must be strong password
		body('account_password')
			.trim()
			.notEmpty()
			.isStrongPassword({
				minLength: 12,
				minLowercase: 1,
				minUppercase: 1,
				minNumbers: 1,
				minSymbols: 1
			})
			.withMessage('Password does not meet requirements.')
	]
}

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
	return [
		// valid email is required
		body('account_email')
			.trim()
			.escape()
			.notEmpty()
			.isEmail()
			.normalizeEmail() // refer to validator.js docs
			.withMessage('A valid email is required.'),

		// password is required and must meet requirements
		body('account_password')
			.trim()
			.notEmpty()
			.isLength({ min: 12 })
			.withMessage('Password does not meet requirements.')
	]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
	const { account_firstname, account_lastname, account_email } = req.body
	let errors = []
	errors = validationResult(req)
	if (!errors.isEmpty()) {
		let nav = await utilities.getNav()
		res.render('account/register', {
			errors,
			title: 'Registration',
			nav,
			account_firstname,
			account_lastname,
			account_email
		})
		return
	}
	next()
}

/* ******************************
 * Check login data and return errors or continue to login process
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
	const { account_email } = req.body
	let errors = []
	errors = validationResult(req)
	if (!errors.isEmpty()) {
		let nav = await utilities.getNav()
		res.render('account/login', {
			errors,
			title: 'Login',
			nav,
			account_email
		})
		return
	}
	next()
}

module.exports = validate

/*  **********************************
 *  Update Account Data Validation Rules
 *  - Validates firstname, lastname, email
 *  - Ensures email is unique to another account
 * ********************************* */
validate.updateAccountRules = () => {
	return [
		// Account id must exist and be an integer
		body('account_id').toInt().isInt().withMessage('Invalid account id.'),

		// First name required
		body('account_firstname')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 1 })
			.withMessage('Please provide a first name.'),

		// Last name required
		body('account_lastname')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 2 })
			.withMessage('Please provide a last name.'),

		// Email valid and unique (if belongs to a different account)
		body('account_email')
			.trim()
			.isEmail()
			.normalizeEmail()
			.withMessage('A valid email is required.')
			.custom(async (account_email, { req }) => {
				const existing = await accountModel.getAccountByEmail(account_email)
				// If an account exists with that email and it's NOT the same user, reject
				if (existing && existing.account_id && existing.account_id !== req.body.account_id) {
					throw new Error('Email exists. Please use a different email.')
				}
			})
	]
}

/* ******************************
 * Check update account data and render view with sticky data on errors
 * ***************************** */
validate.checkUpdateAccountData = async (req, res, next) => {
	const { account_id, account_firstname, account_lastname, account_email } = req.body
	let errors = validationResult(req)
	if (!errors.isEmpty()) {
		let nav = await utilities.getNav()
		return res.render('account/update-account', {
			errors,
			title: 'Update Account Information',
			nav,
			account_id,
			account_firstname,
			account_lastname,
			account_email
		})
	}
	next()
}

/*  **********************************
 *  Change Password Validation Rules
 *  - Validates strong password
 * ********************************* */
validate.changePasswordRules = () => {
	return [
		body('account_id').toInt().isInt().withMessage('Invalid account id.'),
		body('account_password')
			.trim()
			.notEmpty()
			.isStrongPassword({
				minLength: 12,
				minLowercase: 1,
				minUppercase: 1,
				minNumbers: 1,
				minSymbols: 1
			})
			.withMessage('Password does not meet requirements.')
	]
}

/* ******************************
 * Check change password data and render view with context on errors
 * ***************************** */
validate.checkChangePasswordData = async (req, res, next) => {
	const { account_id } = req.body
	let errors = validationResult(req)
	if (!errors.isEmpty()) {
		let nav = await utilities.getNav()
		// Fetch current account data to populate the update-account view properly
		let account_firstname = ''
		let account_lastname = ''
		let account_email = ''
		try {
			const acct = await accountModel.getAccountById(account_id)
			if (acct) {
				account_firstname = acct.account_firstname
				account_lastname = acct.account_lastname
				account_email = acct.account_email
			}
		} catch (e) {}
		return res.render('account/update-account', {
			errors,
			title: 'Update Account Information',
			nav,
			account_id,
			account_firstname,
			account_lastname,
			account_email
		})
	}
	next()
}
