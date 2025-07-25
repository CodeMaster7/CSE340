const invModel = require('../models/inventory-model')
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
	let data = await invModel.getClassifications()
	console.log(data)
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

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
	let grid
	if (data.length > 0) {
		// Using BEM naming convention for classification grid
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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
