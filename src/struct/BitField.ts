export class BitField<T extends string> {
	/**
	 * The flag to bit map
	 */
	public static readonly Flags: Record<string, bigint> = {};

	/**
	 * The total bits in the bitfield
	 */
	public bits: bigint;

	/**
	 * @param bits The initial bits
	 */
	public constructor(bits?: BitFieldResolvable<T>) {
		this.bits = this.constructor.resolve(bits);
	}

	/**
	 * Add bits to the bitfield
	 * @param bits The bits to add
	 *
	 * @returns The bitfield
	 */
	public add(bits: BitFieldResolvable<T>): this {
		this.bits |= this.constructor.resolve(bits);
		return this;
	}

	/**
	 * Remove bits from the bitfield
	 * @param bits The bits to remove
	 *
	 * @returns The bitfield
	 */
	public remove(bits: BitFieldResolvable<T>): this {
		this.bits &= ~this.constructor.resolve(bits);
		return this;
	}

	/**
	 * Check whether the bitfield has all the given bits
	 * @param bits The bits to check
	 *
	 * @returns Whether the bitfield has all the given bits
	 */
	public has(bits: BitFieldResolvable<T>): boolean {
		bits = this.constructor.resolve(bits);
		return (this.bits & bits) === bits;
	}

	/**
	 * Check whether the bitfield has any of the given bits
	 * @param bits The bits to check
	 *
	 * @returns Whether the bitfield has any of the given bits
	 */
	public any(bits: BitFieldResolvable<T>): boolean {
		bits = this.constructor.resolve(bits);
		return (this.bits & bits) !== 0n;
	}

	/**
	 * Calculate the bits from only the values given in flags
	 *
	 * @returns The bits
	 */
	public only() {
		return Object.values(this.constructor.Flags)
			.filter(this.has.bind(this))
			.reduce((bitfield, bits) => bitfield.add(bits), new this.constructor());
	}

	/**
	 * Resolve a bit
	 * @param bit The bit to resolve
	 *
	 * @returns The bits
	 */
	public static resolve(bit?: BitFieldResolvable<string>): bigint {
		if (typeof bit === "bigint") return bit;
		if (bit instanceof BitField) return bit.bits;

		if (typeof bit === "string") {
			return isNaN(Number(bit)) ? this.Flags[bit] ?? 0n : BigInt(bit);
		}

		if (Array.isArray(bit)) {
			return bit.map((bits) => this.resolve(bits)).reduce((bitfield, bits) => bitfield | bits, 0n);
		}

		return 0n;
	}
}

export interface BitField<T extends string> {
	["constructor"]: typeof BitField<T>;
}

export type BitFieldResolvable<T extends string> = bigint | T | BitField<T> | BitFieldResolvable<T>[];
