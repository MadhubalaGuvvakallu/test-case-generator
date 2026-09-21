const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userStoriesController');

// Static routes must be registered before parameterised routes
// to prevent Express matching e.g. "bulk-approve" as an :id value
router.post('/bulk-approve', ctrl.bulkApproveUserStories);
router.delete('/bulk-delete', ctrl.bulkDeleteUserStories);

router.get('/:projectId', ctrl.getUserStories);
router.patch('/:id/approve', ctrl.approveUserStory);
router.patch('/:id', ctrl.updateUserStory);

module.exports = router;
