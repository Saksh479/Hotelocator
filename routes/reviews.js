const express = require("express");
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const Hotel = require("../models/hotelocator");
const Review = require("../models/review");
const { error } = require("console");
const { validateReview, isLoggedIn, verifyReviewAuthor } = require("../middleware.js");


router.post(
    "/",validateReview, isLoggedIn,catchAsync(async (req, res) => {
      const { id } = req.params;
      const hotel = await Hotel.findById(id);
      const review = new Review(req.body.review);
      review.author = req.user._id;
      hotel.reviews.push(review);
      await review.save();
      await hotel.save();
      req.flash("success", "Created new review!");
      res.redirect(`/hotels/${id}`);
    }));
router.delete("/:reviewId", isLoggedIn,verifyReviewAuthor,catchAsync(async(req,res)=>{
      const {id, reviewId} = req.params;
      await Hotel.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
      await Review.findByIdAndDelete(reviewId);
      req.flash("deleted", "Review Deleted");
      res.redirect(`/hotels/${id}`);
  }));

module.exports = router;