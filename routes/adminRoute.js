const express = require('express');
const router = express.Router();
const { signupAdmin, loginAdmin, logoutAdmin, adminProfile, checkAdmin } = require('../controllers/adminController');
const  authAdmin  = require('../middlewares/authAdmin');

router.post('/signup', signupAdmin);
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/profile/:id',authAdmin, adminProfile);
router.get('/check',authAdmin,  checkAdmin); 

module.exports = router;
