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


