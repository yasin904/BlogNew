const express = require('express')
const router = express.Router()
const feedController = require('../controllers/feed.controller')
const validateFeed = require('../middlewares/feedMiddleware')

router.post('/create', validateFeed, feedController.createPost)
router.get('/get', feedController.getPost)
router.delete('/delete/:id', feedController.deletePost)
router.put('/edit/:id', feedController.editPost)
router.get('/view/:id', feedController.viewPost)
router.get('/search', feedController.searchResult)

module.exports = router
