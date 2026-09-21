const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/projectController');
const upload = require('../middleware/uploadMiddleware');

router.post('/', ctrl.createProject);
router.get('/', ctrl.getAllProjects);
router.get('/:id', ctrl.getProject);
router.post('/:id/context', upload.array('files', 10), ctrl.uploadContext);
router.patch('/:id/archive', ctrl.archiveProject);

module.exports = router;
