/**
 * Convert a string value to a bigint, catching errors
 * @param value The value
 *
 * @returns The bigint
 */
export const safeBigInt = (value: string): bigint | null => {
	try {
		return BigInt(value);
	} catch {
		return null;
	}
};
