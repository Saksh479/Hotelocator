const express = require('express')
const router = express.Router();
const catchAsync = require("../utils/catchAsync.js");
const { isLoggedIn, verifyAuthor, validateHotel } = require("../middleware.js");
const hotels = require("../controllers/hotels.js");

router.get("/", catchAsync(hotels.index));

//create
router.get("/new", isLoggedIn , (req, res) => { res.render("hotels/new"); });
router.post("/", isLoggedIn ,validateHotel, catchAsync(hotels.createHotel)); 

//show
router.get("/:id", catchAsync(hotels.showHotel));

//edit
router.get("/:id/edit",isLoggedIn ,catchAsync(hotels.renderEditForm));
router.put("/:id",isLoggedIn, verifyAuthor, catchAsync(hotels.editHotel));

//delete
router.get("/:id/delete",isLoggedIn ,catchAsync(hotels.renderDeleteForm));
router.delete("/:id",isLoggedIn ,catchAsync(hotels.deleteHotel));

module.exports = router;
