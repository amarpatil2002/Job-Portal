const yup = require('yup')

exports.candidatebasicInfo = yup.object({
    name: yup
        .string()
        .trim()
        .required("name is required"),

    age: yup
        .number()
        .required("age is required"),

    gender: yup
        .string()
        .trim()
        .oneOf(["male", "female", "other"], "Invalid gender selected")
        .required("gender is required"),

    marriage: yup
        .boolean()
        .required("marriage is required"),
});

exports.candidatebasicInfoupdate = yup.object({
    name: yup
        .string()
        .trim(),

    age: yup
        .number(),

    gender: yup
        .string()
        .trim()
        .oneOf(["male", "female", "other"], "Invalid gender selected"),

    marriage: yup
        .boolean(),
});

exports.candidatContactInfo = yup.object({
    contactNumber: yup
        .string()
        .trim(),
    address: yup
        .string()
        .trim(),
    city: yup
        .string()
        .trim(),
    state: yup
        .string()
        .trim(),
    country: yup
        .string()
        .trim(),
});

exports.candidatIdentityInfo = yup.object({
    fathersName: yup
        .string()
        .trim(),

    mothersName: yup
        .string()
        .trim(),
    addharNumber: yup
        .string()
        .trim(),
    panNumber: yup
        .number(),
    disability: yup
        .boolean(),
    disabilityName: yup
        .string()
        .trim(),

});