import { ApiValidationErrorCode } from "./ApiValidationErrorCode";
import { ZodIssueCode } from "zod";

export const ApiValidationErrorMessage = {
	[ZodIssueCode.custom]: {
		code: ApiValidationErrorCode.CUSTOM,
		message: "{{params.message}}",
	},
	invalid_snowflake: {
		code: ApiValidationErrorCode.INVALID_SNOWFLAKE,
		message: "Value must be a valid snowflake.",
	},
	[ZodIssueCode.invalid_literal]: {
		code: ApiValidationErrorCode.INVALID_LITERAL,
		message: "Value must be {{expected}}.",
	},
	[ZodIssueCode.invalid_type]: {
		code: ApiValidationErrorCode.INVALID_TYPE,
		message: "Value must be of type {{expected}}.",
	},
	[ZodIssueCode.invalid_string]: {
		code: ApiValidationErrorCode.INVALID_STRING,
		message: "Value must be a valid {{validation}}.",
	},
	[ZodIssueCode.invalid_date]: {
		code: ApiValidationErrorCode.INVALID_DATE,
		message: "Value must be a valid date.",
	},
	[ZodIssueCode.invalid_enum_value]: {
		code: ApiValidationErrorCode.INVALID_ENUM_VALUE,
		message: "Value must be one of {{options}}.",
	},
	[ZodIssueCode.too_small]: {
		code: ApiValidationErrorCode.TOO_SMALL,
		message:
			// eslint-disable-next-line max-len
			"Value must be greater than {{#inclusive}}or equal to {{minimum}}{{/inclusive}}{{^inclusive}}{{minimum}}{{/inclusive}}.",
	},
	[ZodIssueCode.too_big]: {
		code: ApiValidationErrorCode.TOO_BIG,
		message:
			// eslint-disable-next-line max-len
			"Value must be less than {{#inclusive}}or equal to {{maximum}}{{/inclusive}}{{^inclusive}}{{maximum}}{{/inclusive}}.",
	},
	[ZodIssueCode.not_multiple_of]: {
		code: ApiValidationErrorCode.NOT_MULTIPLE_OF,
		message: "Value must be a multiple of {{multipleOf}}.",
	},
	[ZodIssueCode.unrecognized_keys]: {
		code: ApiValidationErrorCode.UNRECOGNIZED_KEYS,
		message: "Unrecognized keys: {{keys}}.",
	},
	[ZodIssueCode.invalid_union_discriminator]: {
		code: ApiValidationErrorCode.INVALID_UNION_DISCRIMINATOR,
		message: "Value must be one of {{options}}",
	},
	[ZodIssueCode.invalid_union]: {
		code: ApiValidationErrorCode.INVALID_UNION,
		message: "Error not implemented (invalid_union).",
	},
	[ZodIssueCode.invalid_arguments]: {
		code: ApiValidationErrorCode.INVALID_ARGUMENTS,
		message: "Error not implemented (invalid_arguments).",
	},
	[ZodIssueCode.invalid_return_type]: {
		code: ApiValidationErrorCode.INVALID_RETURN_TYPE,
		message: "Error not implemented (invalid_return_type).",
	},
	[ZodIssueCode.invalid_intersection_types]: {
		code: ApiValidationErrorCode.INVALID_INTERSECTION_TYPES,
		message: "Error not implemented (invalid_intersection_types).",
	},
};
