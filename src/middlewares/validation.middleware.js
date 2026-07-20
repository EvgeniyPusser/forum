import Joi from "joi";

const schemas = {
  register: Joi.object({
    login: Joi.string().trim().required(),
    password: Joi.string().min(1).required(),
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
  }),
  updateUser: Joi.object({
    firstName: Joi.string().trim(),
    lastName: Joi.string().trim(),
  }).min(1),
  changePassword: Joi.object({
    password: Joi.string().min(1).required(),
  }),
  userParam: Joi.object({
    user: Joi.string().trim().required(),
  }).unknown(true),
  authorParam: Joi.object({
    author: Joi.string().trim().required(),
  }).unknown(true),
  userRoleParams: Joi.object({
    user: Joi.string().trim().required(),
    role: Joi.string().trim().required(),
  }).unknown(true),
  createPost: Joi.object({
    title: Joi.string().trim().required(),
    content: Joi.string().trim().required(),
    tags: Joi.array().items(Joi.string().trim()).default([]),
  }),
  addComment: Joi.object({
    message: Joi.string().trim().required(),
  }),
  updatePost: Joi.object({
    title: Joi.string().trim(),
    content: Joi.string().trim(),
    tags: Joi.array().items(Joi.string().trim()),
  }).min(1),
  dateFormatPeriod: Joi.object({
    dateFrom: Joi.date().iso().required(),
    dateTo: Joi.date().iso().greater(Joi.ref("dateFrom")).required(),
  }),
  tagsQuery: Joi.object({
    values: Joi.alternatives().try(
      Joi.string().trim().min(1),
      Joi.array().items(Joi.string().trim().min(1)),
    ).required(),
  }),
  postIdParam: Joi.object({
    postId: Joi.string().trim().length(24).hex().required(),
  }).unknown(true),
};

function applyValidatedData(request, target, value) {
  if (target === "body") {
    request.body = value;
    return;
  }

  Object.assign(request[target], value);
}

const validate = (schemaName, target = "body") => (request, response, next) => {
  const schema = schemas[schemaName];

  if (!schema) {
    next(new Error(`Validation schema "${schemaName}" is not defined.`));
    return;
  }

  const { error, value } = schema.validate(request[target], {
    abortEarly: true,
    stripUnknown: true,
  });

  if (error) {
    response.status(400).json({
      timestamp: new Date().toISOString(),
      status: 400,
      error: "Bad Request",
      message: error.details[0].message,
      path: request.originalUrl,
    });
    return;
  }

  applyValidatedData(request, target, value);
  next();
};

export const validatePostId = validate("postIdParam", "params");

export default validate;
