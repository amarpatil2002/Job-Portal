const yup = require('yup')

exports.registerSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  password: yup
    .string()
    .min(5, "Password must be at least 6 characters")
    .max(32, "Password cannot exceed 32 characters")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),

  role: yup
    .string()
    .oneOf(["candidate", "company"], "Invalid role selected")
    .required("Role is required"),

  companyName: yup
    .string()
    .trim()
    .when("role", {
      is: "company",
      then: (schema) =>
        schema.required("Company name is required for company registration"),
      otherwise: (schema) => schema.strip(),
    }),
});

exports.loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  password: yup
    .string()
    .min(5, "Password must be at least 5 characters")
    .max(32, "Password cannot exceed 32 characters")
    .required("Password is required"),
});