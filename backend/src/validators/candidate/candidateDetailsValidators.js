const yup = require('yup')


//Personal details
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

    married: yup
        .string(),
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
    fatherName: yup
        .string()
        .trim(),
    motherName: yup
        .string()
        .trim(),
    addharNumber: yup
        .string()
        .trim(),
    panNumber: yup
        .string(),
    disability: yup
        .string(),
    disabilityName: yup
        .string()
        .trim(),

});

//Education details
exports.candidateAddQualification = yup.object({
    collegeName: yup
        .string()
        .trim()
        .required(),
    degree: yup
        .string()
        .trim()
        .required(),
    fieldStudy: yup
        .string()
        .trim()
        .required(),
    startYear: yup
        .number()
        .required()
        .transform((value, originalValue) => {
            return originalValue === "" || originalValue === undefined ? undefined : Number(originalValue)
        }),
    endYear: yup
        .number()
        .required()
        .transform((value, originalValue) => {
            return originalValue === "" || originalValue === undefined ? undefined : Number(originalValue)
        })
        .when("startYear",
            {
                is: (startYear) => startYear !== undefined && startYear !== null,
                then: (schema) => schema.moreThan(
                    yup.ref("startYear"),
                    "Passout year must be greater than start year"
                )
            }),

    // .min(yup.ref("startYear"), "Passout year must be greater than start year"),
    grade: yup
        .string()
        .required()
        .trim(),

})

exports.candidateUpdateQualification = yup.object({
    collegeName: yup.string().trim().notRequired(),
    degree: yup.string().trim().notRequired(),
    fieldStudy: yup.string().trim().notRequired(),
    startYear: yup
        .number()
        .transform((value, originalValue) => {
            if (originalValue === "" || originalValue === null) return null;
            return Number(originalValue);
        })
        .notRequired(),
    endYear: yup
        .number()
        .transform((value, originalValue) => {
            if (originalValue === "" || originalValue === null) return null;
            return Number(originalValue);
        })
        .notRequired()
        .when("startYear", {
            is: (startYear) => startYear !== null && startYear !== undefined,
            then: (schema) =>
                schema.moreThan(
                    yup.ref("startYear"),
                    "Passout year must be greater than start year"
                ),
        }),

    grade: yup.string().trim().notRequired(),
});

