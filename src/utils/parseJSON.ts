const bigintRegex = /^-?\d+n$/;

/**
 * Parse stringified JSON, correctly serializing bigints
 * @param data The stringified JSON data
 *
 * @returns The JSON
 */
export const parseJSON = <T extends object>(data: string): T => {
	return JSON.parse(data, (_, value) => {
		if (typeof value === "string" && bigintRegex.test(value)) {
			return BigInt(value.slice(0, -1));
		}

		return value;
	});
};
