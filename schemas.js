const Joi = require("joi");
const sanitizeHtml = require("sanitize-html");

const Joi = BaseJoi.extend(extension);

module.exports.hotelSchema = Joi.object({
  hotel: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    location: Joi.string().required(),
    rating: Joi.number().required().min(0).max(5),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(0).max(5),
    comment: Joi.string().required(),
  }).required(),
});
