const express = require('express')
const router = express.Router();
const catchAsync = require("../utils/catchAsync.js");
const expressError = require("../utils/expressError.js");
const Hotel = require("../models/hotelocator");
const { hotelSchema} = require("../schemas.js"); 
const { isLoggedIn, verifyAuthor, validateHotel } = require("../middleware.js");


router.get("/", catchAsync(async (req, res) => {
    const hotels = await Hotel.find({});
    res.render("hotels/index", { hotels });
  }));

  //create
router.get("/new", isLoggedIn , (req, res) => {
    res.render("hotels/new");
});

router.post("/", isLoggedIn ,validateHotel, catchAsync(async (req, res) => {
    console.log(req.body);
    const hotel = new Hotel(req.body.hotel);
    hotel.author = req.user._id;
    await hotel.save();
    req.flash("success", "Successfully made a new hotel!");
    console.log(hotel);
    res.redirect(`/hotels/${hotel._id}`);
  })); 

  //show
router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id).populate(
      {
        path:"reviews",
        populate: {
          path:"author"
        }
      }).populate("author");

    if (!hotel) {
      req.flash("error", "Cannot find that hotel!");
      return res.redirect("/hotels");
    }
    console.log(hotel);
    res.render("hotels/show", { hotel });
  }));

  //edit

router.get("/:id/edit",isLoggedIn ,catchAsync(async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);

    if (!hotel) {
      req.flash("error", "Cannot find that hotel!");
      return res.redirect("/hotels");
    }
    if (!hotel.author.equals(req.user._id)) {
      req.flash("error", "You do not have permission to do that!");
      return res.redirect(`/hotels/${id}`);
    }
    res.render("hotels/edit", { hotel });
  }));
  router.put("/:id",isLoggedIn, verifyAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const newHotel = req.body;
    hotel.name = newHotel.name;
    hotel.location = newHotel.location;
    hotel.price = newHotel.price;
    hotel.description = newHotel.description;
    hotel.rating = newHotel.rating;
    await hotel.save();
    req.flash("success", "Successfully updated hotel!");
    console.log(newHotel);
    res.redirect(`/hotels/${hotel._id}`);
  }));

  //delete

router.get("/:id/delete",isLoggedIn ,catchAsync(async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    res.render("hotels/delete", { hotel });
  }));

router.delete("/:id",isLoggedIn ,catchAsync(async (req, res) => {
    const { id } = req.params;
    await Hotel.findByIdAndDelete(id);
    req.flash("deleted", "Hotel Deleted");
    res.redirect("/hotels");
  }));

module.exports = router;
