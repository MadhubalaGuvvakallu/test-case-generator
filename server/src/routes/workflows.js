const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/workflowController');

router.get('/:projectId', ctrl.getWorkflows);
router.get('/detail/:id', ctrl.getWorkflow);
router.patch('/:id/approve', ctrl.approveWorkflow);
router.post('/approve-all', ctrl.approveAllWorkflows);
router.delete('/:id', ctrl.deleteWorkflow);

module.exports = router;
