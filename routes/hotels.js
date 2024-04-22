const express = require('express')
const router = express.Router();
const catchAsync = require("../utils/catchAsync.js");
const { isLoggedIn, verifyAuthor, validateHotel } = require("../middleware.js");
const hotels = require("../controllers/hotels.js");
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
.get(catchAsync(hotels.index))
.post( isLoggedIn ,upload.array('image'),validateHotel, catchAsync(hotels.createHotel)); 

router.get("/new", isLoggedIn , (req, res) => { res.render("hotels/new"); });

router.route('/:id')
.get( catchAsync(hotels.showHotel))
.put(isLoggedIn, verifyAuthor,upload.array('image'),validateHotel, catchAsync(hotels.editHotel))
.delete(isLoggedIn ,catchAsync(hotels.deleteHotel));

//edit
router.get("/:id/edit",isLoggedIn,catchAsync(hotels.renderEditForm));

//delete
router.get("/:id/delete",isLoggedIn ,catchAsync(hotels.renderDeleteForm));

module.exports = router;
