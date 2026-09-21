const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/rulesController');

// Static routes must be registered before parameterised routes
// to prevent Express matching e.g. "bulk-delete" as an :id value
router.post('/bulk-approve', ctrl.bulkApproveRules);
router.delete('/bulk-delete', ctrl.bulkDeleteRules);

router.get('/:projectId', ctrl.getRules);
router.patch('/:id/approve', ctrl.approveRule);
router.patch('/:id', ctrl.updateRule);
router.delete('/:id', ctrl.deleteRule);

module.exports = router;
