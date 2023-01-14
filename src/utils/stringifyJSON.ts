/**
 * Stringify JSON, correctly serializing bigints
 * @param data The JSON data
 *
 * @returns The stringifed JSON
 */
export const stringifyJSON = <T extends object>(data: T) => {
	return JSON.stringify(data, (_, value) => {
		if (typeof value === "bigint") {
			return `${value}n`;
		}

		return value;
	});
};
