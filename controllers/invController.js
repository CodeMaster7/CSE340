const invModel = require('../models/inventory-model')
const utilities = require('../utilities/')

const invCont = {}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
	let nav = await utilities.getNav()
	res.render('./inventory/management', {
		title: 'Vehicle Management',
		nav,
		errors: null
	})
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
	let nav = await utilities.getNav()
	res.render('./inventory/add-classification', {
		title: 'Add New Classification',
		nav,
		errors: null
	})
}

/* ***************************
 *  Process new classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
	let nav = await utilities.getNav()
	const { classification_name } = req.body

	const classificationResult = await invModel.addClassification(classification_name)

	if (classificationResult) {
		// Success: rebuild navigation to include new classification
		nav = await utilities.getNav()
		req.flash('notice', `The ${classification_name} classification was successfully added.`)
		res.status(201).render('./inventory/management', {
			title: 'Vehicle Management',
			nav,
			errors: null
		})
	} else {
		// Failure: return to add classification form with error
		req.flash('error', 'Sorry, the classification addition failed.')
		res.status(501).render('./inventory/add-classification', {
			title: 'Add New Classification',
			nav,
			errors: null
		})
	}
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
	let nav = await utilities.getNav()
	let classificationList = await utilities.buildClassificationList()
	res.render('./inventory/add-inventory', {
		title: 'Add New Vehicle',
		nav,
		classificationList,
		errors: null
	})
}

/* ***************************
 *  Process new inventory item
 * ************************** */
invCont.addInventory = async function (req, res, next) {
	let nav = await utilities.getNav()
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

	const inventoryResult = await invModel.addInventory(
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
	)

	if (inventoryResult) {
		// Success: return to management view with success message
		req.flash('notice', `The ${inv_year} ${inv_make} ${inv_model} was successfully added to inventory.`)
		res.status(201).render('./inventory/management', {
			title: 'Vehicle Management',
			nav,
			errors: null
		})
	} else {
		// Failure: return to add inventory form with error and sticky data
		req.flash('error', 'Sorry, the vehicle addition failed.')
		let classificationList = await utilities.buildClassificationList(classification_id)
		res.status(501).render('./inventory/add-inventory', {
			title: 'Add New Vehicle',
			nav,
			classificationList,
			errors: null,
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
	}
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
	const classification_id = req.params.classificationId
	const data = await invModel.getInventoryByClassificationId(classification_id)
	const grid = await utilities.buildClassificationGrid(data)
	let nav = await utilities.getNav()
	const className = data[0].classification_name
	res.render('./inventory/classification', {
		title: className + ' vehicles',
		nav,
		grid
	})
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
	const inv_id = req.params.invId
	const data = await invModel.getInventoryById(inv_id)
	const vehicleHTML = await utilities.buildVehicleDetailHTML(data)
	let nav = await utilities.getNav()
	const vehicleTitle = `${data.inv_make} ${data.inv_model}`
	res.render('./inventory/detail', {
		title: vehicleTitle,
		nav,
		vehicleHTML
	})
}

module.exports = invCont
