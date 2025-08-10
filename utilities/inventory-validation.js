const { body, validationResult } = require('express-validator')
const utilities = require('.')
const invModel = require('../models/inventory-model')

const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
	return [
		// classification_name is required and must follow specific pattern
		body('classification_name')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 2, max: 30 })
			.withMessage('Classification name must be between 2 and 30 characters.')
			.matches(/^[A-Za-z0-9]+$/)
			.withMessage('Classification name can only contain letters and numbers, no spaces or special characters.'),

		// Check if classification already exists (custom validation)
		body('classification_name').custom(async (classification_name) => {
			const classificationExists = await invModel.checkExistingClassification(classification_name)
			if (classificationExists) {
				throw new Error('Classification name already exists. Please use a different name.')
			}
		})
	]
}

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
	return [
		// Make validation
		body('inv_make')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 2, max: 50 })
			.withMessage('Vehicle make must be between 2 and 50 characters.'),

		// Model validation
		body('inv_model')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 2, max: 50 })
			.withMessage('Vehicle model must be between 2 and 50 characters.'),

		// Year validation
		body('inv_year')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 4, max: 4 })
			.withMessage('Year must be exactly 4 digits.')
			.isNumeric()
			.withMessage('Year must be a number.')
			.isInt({ min: 1900, max: new Date().getFullYear() + 1 })
			.withMessage(`Year must be between 1900 and ${new Date().getFullYear() + 1}.`),

		// Description validation
		body('inv_description')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 10, max: 1000 })
			.withMessage('Description must be between 10 and 1000 characters.'),

		// Image path validation
		body('inv_image').trim().notEmpty().withMessage('Image path is required.'),

		// Thumbnail path validation
		body('inv_thumbnail').trim().notEmpty().withMessage('Thumbnail path is required.'),

		// Price validation
		body('inv_price')
			.trim()
			.notEmpty()
			.isNumeric()
			.withMessage('Price must be a number.')
			.isFloat({ min: 0 })
			.withMessage('Price must be greater than 0.'),

		// Miles validation
		body('inv_miles')
			.trim()
			.notEmpty()
			.isNumeric()
			.withMessage('Miles must be a number.')
			.isInt({ min: 0 })
			.withMessage('Miles must be 0 or greater.'),

		// Color validation
		body('inv_color')
			.trim()
			.escape()
			.notEmpty()
			.isLength({ min: 2, max: 30 })
			.withMessage('Color must be between 2 and 30 characters.'),

		// Classification ID validation
		body('classification_id').trim().notEmpty().isNumeric().withMessage('Please select a valid classification.')
	]
}

/* ******************************
 * Check classification data and return errors or continue to processing
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
	const { classification_name } = req.body
	let errors = []
	errors = validationResult(req)
	if (!errors.isEmpty()) {
		let nav = await utilities.getNav()
		res.render('inventory/add-classification', {
			errors,
			title: 'Add New Classification',
			nav,
			classification_name
		})
		return
	}
	next()
}

/* ******************************
 * Check inventory data and return errors or continue to processing
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
	const {
		inv_make,
		inv_model,
		inv_year,
		inv_description,
		inv_image,
		inv_thumbnail,
		inv_price,
		inv_miles,
		inv_color,
		classification_id
	} = req.body

	let errors = []
	errors = validationResult(req)

	if (!errors.isEmpty()) {
		let nav = await utilities.getNav()
		let classificationList = await utilities.buildClassificationList(classification_id)
		res.render('inventory/add-inventory', {
			errors,
			title: 'Add New Vehicle',
			nav,
			classificationList,
			inv_make,
			inv_model,
			inv_year,
			inv_description,
			inv_image,
			inv_thumbnail,
			inv_price,
			inv_miles,
			inv_color,
			classification_id
		})
		return
	}
	next()
}

/* ******************************
 * Check update inventory data and return errors or continue to processing
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
	const {
		inv_id,
		inv_make,
		inv_model,
		inv_year,
		inv_description,
		inv_image,
		inv_thumbnail,
		inv_price,
		inv_miles,
		inv_color,
		classification_id
	} = req.body

	let errors = []
	errors = validationResult(req)

	if (!errors.isEmpty()) {
		let nav = await utilities.getNav()
		let classificationList = await utilities.buildClassificationList(classification_id)
		res.render('inventory/edit-inventory', {
			errors,
			title: 'Edit Vehicle',
			nav,
			classificationList,
			inv_id,
			inv_make,
			inv_model,
			inv_year,
			inv_description,
			inv_image,
			inv_thumbnail,
			inv_price,
			inv_miles,
			inv_color,
			classification_id
		})
		return
	}
	next()
}

module.exports = validate
