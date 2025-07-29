const invModel = require('../models/inventory-model')
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
	let data = await invModel.getClassifications()
	let list = '<ul class="navigation__list">'
	list += '<li class="navigation__item"><a href="/" title="Home page" class="navigation__link">Home</a></li>'
	data.rows.forEach((row) => {
		list += '<li class="navigation__item">'
		list +=
			'<a href="/inv/type/' +
			row.classification_id +
			'" title="See our inventory of ' +
			row.classification_name +
			' vehicles" class="navigation__link">' +
			row.classification_name +
			'</a>'
		list += '</li>'
	})
	list += '</ul>'
	return list
}

/* ************************
 * Constructs the classification select list for inventory forms
 ************************** */
Util.buildClassificationList = async function (classification_id = null) {
	let data = await invModel.getClassifications()
	let classificationList =
		'<select name="classification_id" id="classificationList" class="add-inventory__form-input" required>'
	classificationList += "<option value=''>Choose a Classification</option>"
	data.rows.forEach((row) => {
		classificationList += '<option value="' + row.classification_id + '"'
		if (classification_id != null && row.classification_id == classification_id) {
			classificationList += ' selected '
		}
		classificationList += '>' + row.classification_name + '</option>'
	})
	classificationList += '</select>'
	return classificationList
}

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
	let grid
	if (data.length > 0) {
		grid = '<ul class="classification-grid">'
		data.forEach((vehicle) => {
			grid += '<li class="classification-grid__item">'
			// Vehicle image link wrapper
			grid += '<div class="classification-grid__image-wrapper">'
			grid +=
				'<a href="../../inv/detail/' +
				vehicle.inv_id +
				'" title="View ' +
				vehicle.inv_make +
				' ' +
				vehicle.inv_model +
				' details" class="classification-grid__image-link">'
			grid +=
				'<img src="' +
				vehicle.inv_thumbnail +
				'" alt="Image of ' +
				vehicle.inv_make +
				' ' +
				vehicle.inv_model +
				' on CSE Motors" class="classification-grid__image" />'
			grid += '</a>'
			grid += '</div>'
			// Vehicle info section
			grid += '<div class="classification-grid__info">'
			grid += '<hr class="classification-grid__divider" />'
			grid += '<h2 class="classification-grid__title">'
			grid +=
				'<a href="../../inv/detail/' +
				vehicle.inv_id +
				'" title="View ' +
				vehicle.inv_make +
				' ' +
				vehicle.inv_model +
				' details" class="classification-grid__title-link">' +
				vehicle.inv_make +
				' ' +
				vehicle.inv_model +
				'</a>'
			grid += '</h2>'
			grid +=
				'<span class="classification-grid__price">$' +
				new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
				'</span>'
			grid += '</div>'
			grid += '</li>'
		})
		grid += '</ul>'
	} else {
		// Using BEM naming for error notice
		grid += '<p class="classification-grid__notice">Sorry, no matching vehicles could be found.</p>'
	}
	return grid
}

/* **************************************
 * Build the vehicle detail view HTML
 * ************************************ */
Util.buildVehicleDetailHTML = async function (vehicle) {
	let detailHTML = ''
	if (vehicle) {
		// Format price with US currency symbol and commas
		const formattedPrice = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(vehicle.inv_price)

		// Format mileage with commas
		const formattedMileage = new Intl.NumberFormat('en-US').format(vehicle.inv_miles)

		// Using BEM naming convention for vehicle detail
		detailHTML += '<div class="vehicle-detail">'

		// Image section (left side on larger screens)
		detailHTML += '<div class="vehicle-detail__image-section">'
		detailHTML +=
			'<img src="' +
			vehicle.inv_image +
			'" alt="Image of ' +
			vehicle.inv_make +
			' ' +
			vehicle.inv_model +
			'" class="vehicle-detail__image" />'
		detailHTML += '</div>'

		// Content section (right side on larger screens)
		detailHTML += '<div class="vehicle-detail__content">'

		// Main vehicle info (prominent display)
		detailHTML += '<div class="vehicle-detail__main-info">'
		detailHTML += '<h2 class="vehicle-detail__title">' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h2>'
		detailHTML += '<p class="vehicle-detail__price">' + formattedPrice + '</p>'
		detailHTML += '</div>'

		// Vehicle specifications
		detailHTML += '<div class="vehicle-detail__specs">'
		detailHTML += '<p class="vehicle-detail__spec"><strong>Year:</strong> ' + vehicle.inv_year + '</p>'
		detailHTML += '<p class="vehicle-detail__spec"><strong>Mileage:</strong> ' + formattedMileage + ' miles</p>'
		detailHTML += '<p class="vehicle-detail__spec"><strong>Color:</strong> ' + vehicle.inv_color + '</p>'
		detailHTML += '</div>'

		// Vehicle description
		detailHTML += '<div class="vehicle-detail__description">'
		detailHTML += '<h3 class="vehicle-detail__description-title">Vehicle Description</h3>'
		detailHTML += '<p class="vehicle-detail__description-text">' + vehicle.inv_description + '</p>'
		detailHTML += '</div>'

		detailHTML += '</div>' // Close content section
		detailHTML += '</div>' // Close vehicle-detail wrapper
	} else {
		// Error message if no vehicle found
		detailHTML += '<p class="vehicle-detail__error">Sorry, the requested vehicle could not be found.</p>'
	}
	return detailHTML
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
