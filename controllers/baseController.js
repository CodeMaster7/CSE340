const utilities = require('../utilities/')
const baseController = {}

baseController.buildHome = async function (req, res) {
	const nav = await utilities.getNav()
	res.render('index', { title: 'Home', nav })
}

/* ***************************
 *  Intentionally trigger a 500 server error for testing
 * ************************** */
baseController.intentionalError = async function (req, res, next) {
	// This function intentionally throws a 500 error for testing error handling
	throw new Error('Intentional 500 error for testing error handling middleware')
}

module.exports = baseController
