const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/generationController');

router.post('/:projectId', ctrl.generate);
router.post('/:projectId/regenerate', ctrl.regenerate);

module.exports = router;
