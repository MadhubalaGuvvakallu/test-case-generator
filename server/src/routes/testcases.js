const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/testcaseController');

// Static routes must be registered before parameterised routes
// to prevent Express matching e.g. "bulk-delete" as an :id value
router.get('/detail/:id', ctrl.getTestCase);
router.post('/bulk-approve', ctrl.bulkApproveTestCases);
router.delete('/bulk-delete', ctrl.bulkDeleteTestCases);

router.get('/:projectId', ctrl.getTestCases);
router.patch('/:id/approve', ctrl.approveTestCase);
router.patch('/:id', ctrl.updateTestCase);
router.delete('/:id', ctrl.deleteTestCase);

module.exports = router;
