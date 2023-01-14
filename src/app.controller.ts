import { Controller, HttpCode, HttpStatus, Get } from "@nestjs/common";

@Controller()
export class AppController {
	@Get()
	@HttpCode(HttpStatus.NO_CONTENT)
	getRoot(): void {
		return;
	}
}
