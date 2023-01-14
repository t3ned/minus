import { CipherKey, randomBytes, createDecipheriv, createCipheriv } from "crypto";

export class Encrypter {
	/**
	 * The raw key used by the algorithms
	 */
	#cipherKey: CipherKey;

	/**
	 * @param cipherKey The raw key used by the algorithms
	 */
	constructor(cipherKey: Buffer) {
		this.#cipherKey = cipherKey;
	}

	/**
	 * Encrypts data using the aes-256-cbc algorithm
	 * @param data The data to decrypt
	 *
	 * @returns The encrypted data
	 */
	encrypt(data: string): string {
		const iv = randomBytes(16);
		const cipher = createCipheriv("aes-256-cbc", this.#cipherKey, iv);
		const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

		return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
	}

	/**
	 * Decrypts data using the aes-256-cbc algorithm
	 * @param data The data to decrypt
	 *
	 * @returns The decrypted data
	 */
	decrypt(data: string): string {
		const [ivHex, encryptedData] = data.split(":");
		if (!ivHex || !encryptedData) throw new Error("Invalid ciphered data");

		const iv = Buffer.from(ivHex, "hex");
		const encrypted = Buffer.from(encryptedData, "hex");
		const decipher = createDecipheriv("aes-256-cbc", this.#cipherKey, iv);
		const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

		return decrypted.toString();
	}
}
