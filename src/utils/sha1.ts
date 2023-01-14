import { createHash } from "crypto";

/**
 * Hash data using the sha1 algorithm
 * @param data The data
 *
 * @returns The hash
 */
export const sha1 = (data: string): string => {
	return createHash("sha1").update(data, "utf-8").digest("hex");
};
