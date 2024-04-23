const Hotel = require("../models/hotelocator");
const cloudinary = require("cloudinary").v2;
const mapboxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mapboxGeoCoding({ accessToken: mapboxToken });

module.exports.index = async (req, res) => {
    const hotels = await Hotel.find({});
    res.render("hotels/index", { hotels });
}

module.exports.createHotel = async (req, res) => {  

  const geoData =await geoCoder.forwardGeocode({ 
    query: req.body.hotel.location, 
    limit: 1 
  }).send()
  const hotel = new Hotel(req.body.hotel);
  hotel.geometry = geoData.body.features[0].geometry;
  hotel.author = req.user._id;
  hotel.image = req.files.map(file => {
    return {
      url: file.path,
      filename: file.filename
    }
  });
  await hotel.save();
  console.log(hotel);
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
    console.log(req.body);
    const hotel = await Hotel.findByIdAndUpdate(id, {
      ...req.body.hotel,
    });
    const imgs = req.files.map(file => ({
        url: file.path,
        filename: file.filename
      }));
    hotel.image.push(...imgs);
    if(req.body.deleteImages){
      for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename);
      }
    await hotel.updateOne({$pull: {image: {filename: {$in: req.body.deleteImages}}}})
    }
    // console.log(hotel);
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
