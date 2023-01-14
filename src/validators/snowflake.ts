import { preprocessBigint } from "./preprocessors/bigint";
import { snowflake } from "../utils";
import { ZodIssueCode, z } from "zod";

export const snowflakeValidator = () =>
	preprocessBigint(
		z.bigint({
			invalid_type_error: "invalid_snowflake",
			required_error: "invalid_snowflake",
		}),
	).superRefine((arg, ctx) => {
		if (arg < 0n) {
			ctx.addIssue({
				code: ZodIssueCode.too_small,
				inclusive: true,
				type: "number",
				minimum: 1,
				message: "Snowflake must be greater than or equal to 0.",
			});
		}

		const maxSnowflake = snowflake.generate();
		if (arg > maxSnowflake) {
			ctx.addIssue({
				code: ZodIssueCode.too_big,
				inclusive: true,
				type: "number",
				maximum: Number(maxSnowflake),
				message: `Snowflake must be smaller than or equal to ${maxSnowflake}.`,
			});
		}

		return arg;
	});
