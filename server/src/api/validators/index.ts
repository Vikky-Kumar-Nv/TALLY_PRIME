import { ZodError } from "zod";

import AdminValidator, { AdminType } from "./admin.validators";


export {
  zodError,
  AdminValidator,
  AdminType,
};

const zodError = (error: ZodError) => {
  let errors: any = {};
  error.errors.map((issue) => {
    const path = issue.path?.[0];
    if (path) errors[path] = issue.message;
  });
  return errors;
};
