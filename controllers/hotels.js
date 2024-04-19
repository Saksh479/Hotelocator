const Hotel = require("../models/hotelocator");

module.exports.index = async (req, res) => {
    const hotels = await Hotel.find({});
    res.render("hotels/index", { hotels });
}

module.exports.createHotel = async (req, res) => {
    const hotel = new Hotel(req.body.hotel);
    hotel.author = req.user._id;
    await hotel.save();
    req.flash("success", "Successfully made a new hotel!");
    res.redirect(`/hotels/${hotel._id}`);
}

module.exports.showHotel = async (req, res) => {
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
    res.render("hotels/show", { hotel });
  }

module.exports.renderEditForm = async (req, res) => {
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
}

module.exports.editHotel = async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    const newHotel = req.body;
    hotel.name = newHotel.name;
    hotel.location = newHotel.location;
    hotel.price = newHotel.price;
    hotel.description = newHotel.description;
    hotel.rating = newHotel.rating;
    await hotel.save();
    req.flash("success", "Successfully updated hotel!");
    res.redirect(`/hotels/${hotel._id}`);
}

module.exports.renderDeleteForm = async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    res.render("hotels/delete", { hotel });
}

module.exports.deleteHotel = async (req, res) => {
    const { id } = req.params;
    await Hotel.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted hotel");
    res.redirect("/hotels");
}