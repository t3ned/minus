import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { InvalidFormBodyException } from "@/errors/exceptions";
import { ZodTypeAny } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
	/**
	 * @param schema The zod validation schema
	 */
	constructor(private schema: ZodTypeAny) {}

	/**
	 * Transform a value
	 * @param value The value
	 * @param metadata The argument metadata
	 *
	 * @returns The transformed value
	 */
	async transform(value: any, metadata: ArgumentMetadata) {
		const result = await this.schema.safeParseAsync(value, { path: [metadata.type] });
		if (result.success) return result.data;

		throw new InvalidFormBodyException(result.error);
	}
}
