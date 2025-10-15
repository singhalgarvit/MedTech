import {ZodError} from "zod";

export const validate = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.parseAsync(req.body);
    next();
  } catch (error) {
    res.status(500).json({error: "Internal Server Error"});
  }
};
