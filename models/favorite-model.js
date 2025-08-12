const pool = require('../database/')

/* *****************************
 *  List favorites for an account (joined with inventory)
 * ***************************** */
async function listFavoritesByAccount(account_id) {
	const sql = `
    SELECT i.inv_id,
           i.inv_make,
           i.inv_model,
           i.inv_year,
           i.inv_description,
           i.inv_image,
           i.inv_thumbnail,
           i.inv_price,
           i.inv_miles,
           i.inv_color,
           i.classification_id,
           f.created_at
    FROM public.favorite f
    JOIN public.inventory i ON i.inv_id = f.inv_id
    WHERE f.account_id = $1
    ORDER BY f.created_at DESC
  `
	const result = await pool.query(sql, [account_id])
	return result.rows
}

/* *****************************
 *  Add a favorite (idempotent via unique constraint)
 * ***************************** */
async function addFavorite(account_id, inv_id) {
	const sql = `
    INSERT INTO public.favorite (account_id, inv_id)
    VALUES ($1, $2)
    ON CONFLICT (account_id, inv_id) DO NOTHING
    RETURNING favorite_id, account_id, inv_id, created_at
  `
	const result = await pool.query(sql, [account_id, inv_id])
	// If already existed, rowCount will be 0; treat as success (idempotent add)
	return result.rows[0] || null
}

/* *****************************
 *  Remove a favorite
 * ***************************** */
async function removeFavorite(account_id, inv_id) {
	const sql = `DELETE FROM public.favorite WHERE account_id = $1 AND inv_id = $2`
	const result = await pool.query(sql, [account_id, inv_id])
	return result.rowCount > 0
}

module.exports = { listFavoritesByAccount, addFavorite, removeFavorite }
