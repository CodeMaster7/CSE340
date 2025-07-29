const pool = require('../database/')

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
	return await pool.query('SELECT * FROM public.classification ORDER BY classification_name')
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
	try {
		const data = await pool.query(
			`SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
			[classification_id]
		)
		return data.rows
	} catch (error) {
		console.error('getclassificationsbyid error ' + error)
	}
}

/* ***************************
 *  Get single inventory item by inventory_id
 * ************************** */
async function getInventoryById(inventory_id) {
	try {
		const data = await pool.query(
			`SELECT * FROM public.inventory
      WHERE inv_id = $1`,
			[inventory_id]
		)
		return data.rows[0]
	} catch (error) {
		console.error('getInventoryById error ' + error)
	}
}

/* ***************************
 *  Check if classification name already exists
 * ************************** */
async function checkExistingClassification(classification_name) {
	try {
		const data = await pool.query('SELECT * FROM public.classification WHERE classification_name = $1', [
			classification_name
		])
		return data.rowCount > 0
	} catch (error) {
		console.error('checkExistingClassification error: ' + error)
		return false
	}
}

/* ***************************
 *  Add new classification to database
 * ************************** */
async function addClassification(classification_name) {
	try {
		const data = await pool.query(
			'INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *',
			[classification_name]
		)
		return data.rows[0]
	} catch (error) {
		console.error('addClassification error: ' + error)
		return false
	}
}

/* ***************************
 *  Add new inventory item to database
 * ************************** */
async function addInventory(
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
) {
	try {
		const data = await pool.query(
			`INSERT INTO public.inventory
			(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
			RETURNING *`,
			[
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
			]
		)
		return data.rows[0]
	} catch (error) {
		console.error('addInventory error: ' + error)
		return false
	}
}

module.exports = {
	getClassifications,
	getInventoryByClassificationId,
	getInventoryById,
	checkExistingClassification,
	addClassification,
	addInventory
}
