// Needed Resources
const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')
const utilities = require('../utilities/')
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory management view
router.get('/', utilities.handleErrors(invController.buildManagement))

// Route to get inventory by classification ID
router.get('/getInventory/:classification_id', utilities.handleErrors(invController.getInventoryJSON))

// Route to build add classification view
router.get('/add-classification', utilities.handleErrors(invController.buildAddClassification))

// Route to process add classification
router.post(
	'/add-classification',
	invValidate.classificationRules(),
	invValidate.checkClassificationData,
	utilities.handleErrors(invController.addClassification)
)

// Route to build add inventory view
router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventory))

// Route to process add inventory
router.post(
	'/add-inventory',
	invValidate.inventoryRules(),
	invValidate.checkInventoryData,
	utilities.handleErrors(invController.addInventory)
)

// Route to build inventory by classification view
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory detail view by inventory ID
router.get('/detail/:invId', utilities.handleErrors(invController.buildByInventoryId))

// Route to edit inventory
router.get('/edit/:invId', utilities.handleErrors(invController.buildEditInventory))

// Route to process update inventory
router.post(
	'/update',
	invValidate.inventoryRules(),
	invValidate.checkUpdateData,
	utilities.handleErrors(invController.updateInventory)
)

// Route to build delete inventory view 
router.get('/delete/:invId', utilities.handleErrors(invController.buildDeleteInventory))

// Route to process delete inventory
router.post('/delete', utilities.handleErrors(invController.deleteInventory))

module.exports = router
