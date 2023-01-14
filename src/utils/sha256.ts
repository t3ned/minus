import { createHash } from "crypto";

/**
 * Hash data using the sha256 algorithm
 * @param data The data
 *
 * @returns The hash
 */
export const sha256 = (data: string): string => {
	return createHash("sha256").update(data, "utf-8").digest("hex");
};
