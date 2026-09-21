const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/exportController');

router.post('/:projectId/json', ctrl.exportJSON);
router.post('/:projectId/csv', ctrl.exportCSV);
router.get('/:projectId', ctrl.exportAll);

module.exports = router;
