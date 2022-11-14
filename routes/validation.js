
//VALIDATION
const Joi = require("joi");


//REGISTER VAIDATION

const validationSchema = Joi.object({
    name: Joi.string()
    .min(6)
    .max(10)
    .required(),
    
    email: Joi.string()
    .min(6)
    .email()
    .required(),
    
    password: Joi.string()
    .min(6)
    .required()
  });


// LOGIN VAIDATION
const loginSchema = Joi.object({
    email: Joi.string()
    .min(6)
    .email()
    .required(),
    
    password: Joi.string()
    .min(6)
    .required()
  });


//
module.exports.validationSchema = validationSchema;
module.exports.loginSchema = loginSchema;