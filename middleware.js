const Hotel = require('./models/hotelocator.js');
const Review = require('./models/review.js');
const { hotelSchema } = require('./schemas.js');
const { expressError } = require('./utils/expressError.js');
const { reviewSchema } = require("./schemas.js");
module.exports.isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in to add a new hotel");
        return res.redirect("/login");
    }next();
} 

module.exports.verifyAuthor = async(req, res, next) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    if (!hotel.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/hotels/${id}`);
    }
    next();
}

module.exports.verifyReviewAuthor = async(req, res, next) => {
  const { id , reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
      req.flash("error", "You do not have permission to do that!");
      return res.redirect(`/hotels/${id}/reviews/${reviewId}`);
  }
  next();
}

module.exports.validateHotel = (req, res, next) => {
    const result = hotelSchema.validate(req.body);
    if (result.error) {
      const msg = result.error.details.map((el) => el.message).join(",");
      throw new expressError(msg, 400);
    } else {
      next();
    }
  };

module.exports.validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
      const msg = result.error.details.map((el) => el.message).join(",");
      console.log(msg);
      throw new expressError(msg, 400); // Change 'result.error.details' to 'msg' to display the error message
    } else {
      next();
}};