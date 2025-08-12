-- ================================================================
-- INSERT INTO ACCOUNT
-- ================================================================

INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- ================================================================
-- UPDATE ACCOUNT
-- ================================================================
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

-- ================================================================
-- DELETE TONY STARK RECORD from ACCOUNT
-- ================================================================

DELETE FROM account
WHERE account_id = 1;

-- ================================================================
-- UPDATE GM Hummer from INVENTORY
-- Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors"
-- ================================================================

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interior')
WHERE inv_make = 'GM';

-- ================================================================
-- INNER JOIN INVENTORY AND CLASSIFICATION
-- ================================================================

SELECT inventory.inv_make, inventory.inv_model, classification.classification_name
FROM inventory
INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

-- ================================================================
-- UPDATE INVENTORY
-- Update all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns using a single query.
-- ================================================================

UPDATE inventory
SET inv_image = REPLACE(inv_image, 'images/', 'images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehicles/');

-- ================================================================
-- FAVORITES (Examples to exercise new table)
-- ================================================================

-- Create a favorite (example values)
-- $1 account_id, $2 inv_id when used in prepared statements
INSERT INTO public.favorite (account_id, inv_id) VALUES (1, 2)
ON CONFLICT (account_id, inv_id) DO NOTHING RETURNING favorite_id, created_at;

-- Remove a favorite
DELETE FROM public.favorite WHERE account_id = 1 AND inv_id = 2 RETURNING favorite_id;

-- ================================================================
-- LIST FAVORITES FOR AN ACCOUNT (JOIN WITH INVENTORY DETAILS)
-- Run in pgAdmin 4 to view a user's favorites
-- Replace :account_id with the target account id
-- ================================================================

-- 1) Do you have any favorites at all?
SELECT * FROM public.favorite ORDER BY created_at DESC;

-- 2) What accounts exist?
SELECT account_id, account_email, account_type FROM public.account ORDER BY account_id;

-- 3) Join across to see everything (no filter)
SELECT a.account_email, i.inv_make, i.inv_model, f.created_at
FROM public.favorite f
JOIN public.account a ON a.account_id = f.account_id
JOIN public.inventory i ON i.inv_id = f.inv_id
ORDER BY f.created_at DESC;
