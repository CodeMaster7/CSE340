const invModel = require('../models/inventory-model')
const utilities = require('../utilities/')

const invCont = {}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
	let nav = await utilities.getNav()
	const classificationSelect = await utilities.buildClassificationList()
	res.render('./inventory/management', {
		title: 'Vehicle Management',
		nav,
		classificationSelect,
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
		vehicleHTML,
		inv_id: data.inv_id
	})
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
	const inv_id = parseInt(req.params.invId)
	let nav = await utilities.getNav()
	const itemData = await invModel.getInventoryById(inv_id)
	const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
	const itemName = `${itemData.inv_make} ${itemData.inv_model}`
	res.render('./inventory/edit-inventory', {
		title: 'Edit ' + itemName,
		nav,
		classificationSelect: classificationSelect,
		errors: null,
		inv_id: itemData.inv_id,
		inv_make: itemData.inv_make,
		inv_model: itemData.inv_model,
		inv_year: itemData.inv_year,
		inv_description: itemData.inv_description,
		inv_image: itemData.inv_image,
		inv_thumbnail: itemData.inv_thumbnail,
		inv_price: itemData.inv_price,
		inv_miles: itemData.inv_miles,
		inv_color: itemData.inv_color,
		classification_id: itemData.classification_id
	})
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
	const inv_id = parseInt(req.params.invId)
	let nav = await utilities.getNav()
	const itemData = await invModel.getInventoryById(inv_id)
	const itemName = `${itemData.inv_make} ${itemData.inv_model}`
	res.render('./inventory/delete-confirm', {
		title: 'Delete ' + itemName,
		nav,
		errors: null,
		inv_id: itemData.inv_id,
		inv_make: itemData.inv_make,
		inv_model: itemData.inv_model,
		inv_year: itemData.inv_year,
		inv_price: itemData.inv_price
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
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
	let nav = await utilities.getNav()
	const {
		inv_id,
		inv_make,
		inv_model,
		inv_description,
		inv_image,
		inv_thumbnail,
		inv_price,
		inv_year,
		inv_miles,
		inv_color,
		classification_id
	} = req.body
	const updateResult = await invModel.updateInventory(
		inv_id,
		inv_make,
		inv_model,
		inv_description,
		inv_image,
		inv_thumbnail,
		inv_price,
		inv_year,
		inv_miles,
		inv_color,
		classification_id
	)

	if (updateResult) {
		const itemName = updateResult.inv_make + ' ' + updateResult.inv_model
		req.flash('notice', `The ${itemName} was successfully updated.`)
		res.redirect('/inv/')
	} else {
		const classificationSelect = await utilities.buildClassificationList(classification_id)
		const itemName = `${inv_make} ${inv_model}`
		req.flash('notice', 'Sorry, the insert failed.')
		res.status(501).render('inventory/edit-inventory', {
			title: 'Edit ' + itemName,
			nav,
			classificationSelect: classificationSelect,
			errors: null,
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
	}
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
	let nav = await utilities.getNav()
	// Collect the inv_id value and use parseInt function
	const inv_id = parseInt(req.body.inv_id)

	// Pass the inv_id value to model-based function to delete the inventory item
	const deleteResult = await invModel.deleteInventoryItem(inv_id)

	if (deleteResult) {
		// Success: return flash message to inventory management view
		req.flash('notice', `The vehicle was successfully deleted.`)
		res.redirect('/inv/')
	} else {
		// Failure: return flash failure message and redirect to rebuild delete view
		req.flash('error', 'Sorry, the delete failed.')
		res.redirect(`/inv/delete/${inv_id}`)
	}
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
	const classification_id = parseInt(req.params.classification_id)
	const invData = await invModel.getInventoryByClassificationId(classification_id)
	if (invData[0].inv_id) {
		return res.json(invData)
	} else {
		next(new Error('No data returned'))
	}
}

module.exports = invCont
