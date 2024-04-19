const express = require("express");
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, verifyReviewAuthor } = require("../middleware.js");
const reviews = require("../controllers/reviews.js");


router.post("/",validateReview, isLoggedIn,catchAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn,verifyReviewAuthor,catchAsync(reviews.deleteReview));

module.exports = router;