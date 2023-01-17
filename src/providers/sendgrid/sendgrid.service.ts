import { EMAIL_TEMPLATES } from "./sendgrid.constants";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import sendgrid from "@sendgrid/mail";
import handlebars from "handlebars";

@Injectable()
export class SendGridSevice implements OnModuleInit {
	/**
	 * @param config The config service
	 */
	constructor(private config: ConfigService) {}

	/**
	 * Initialize the module
	 */
	onModuleInit(): void {
		const apiKey = this.config.getOrThrow<string>("sendgrid.apiKey");
		sendgrid.setApiKey(apiKey);
	}

	/**
	 * Send an email
	 * @param email The email
	 * @param templateKey The key of the template
	 * @param params The template params
	 */
	async sendEmail<T extends SendGridSevice.TemplateKeys, Params extends SendGridSevice.TemplateParams<T>>(
		email: string,
		...args: keyof Params extends never
			? [templateKey: T]
			: [templateKey: T, params: SendGridSevice.TemplateParams<T>]
	): Promise<void> {
		const template = EMAIL_TEMPLATES[args[0]];
		const { subject, html, text } = args[1]
			? this.renderEmailTemplate(EMAIL_TEMPLATES[args[0]], args[1])
			: template;

		const fromEmail = this.config.getOrThrow<string>("sendgrid.fromEmail");
		const fromName = this.config.getOrThrow<string>("sendgrid.fromName");

		// TODO: queue
		sendgrid.send({
			from: {
				email: fromEmail,
				name: fromName,
			},
			to: email,
			subject,
			html,
			text,
		});
	}

	/**
	 * Render an email template
	 * @param template The email template
	 * @param params The templating params
	 *
	 * @returns The compiled email template
	 */
	private renderEmailTemplate = <T extends Record<string, string>>(template: T, params: object): T => {
		return Object.entries(template).reduce((prev, [key, value]) => {
			prev[key] = handlebars.compile(value, { noEscape: true })(params);
			return prev;
		}, {} as Record<string, string>) as T;
	};
}

export namespace SendGridSevice {
	/** @see https://twitter.com/trashh_dev/status/1558209179071877120 */

	export type Templates = typeof EMAIL_TEMPLATES;
	export type TemplateKeys = keyof Templates;

	export type TemplateInner<
		S extends string,
		U extends object = {},
	> = S extends `${string}{{${infer V}}}${infer Rest}` //
		? TemplateInner<Rest, U & { [key in V]: string }>
		: U;

	export type TemplateParams<S extends TemplateKeys> = TemplateInner<Templates[S]["subject"]> &
		TemplateInner<Templates[S]["text"]> &
		TemplateInner<Templates[S]["html"]>;
}
