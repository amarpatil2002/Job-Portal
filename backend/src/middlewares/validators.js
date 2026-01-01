const { ValidationError } = require("yup")

exports.validate = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.validate(req.body, {
      abortEarly: false,   // return all validation errors
      stripUnknown: true,  // remove fields not in schema
    });

    next();
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.errors,
      });
    }

    next(err);
  }
};

