import { Injectable } from "@nestjs/common";
import { Session } from "@prisma/client";

@Injectable()
export class SessionMapper {
	/**
	 * Map a session
	 * @param session The session
	 *
	 * @returns The mapped session
	 */
	map(session: Session): SessionMapper.Session {
		return {
			id: session.id.toString(),
			city: session.city,
			region: session.region,
			timezone: session.timezone,
			country_code: session.countryCode,
			browser: session.browser,
			os: session.operatingSystem,
		};
	}

	/**
	 * Map many sessions
	 * @param sessions The sessions
	 *
	 * @returns The mapped sessions
	 */
	mapMany(sessions: Session[]): SessionMapper.Session[] {
		return sessions.map(this.map.bind(this));
	}

	/**
	 * Map the current session and past sessions
	 * @param currentSession The current session
	 * @param sessions The past sessions
	 *
	 * @returns The sessions
	 */
	mapCurrentAndMany(currentSession: Session, sessions: Session[]): SessionMapper.CurrentAndManySessions {
		return {
			current_session_id: currentSession.id.toString(),
			sessions: this.mapMany(sessions),
		};
	}
}

export namespace SessionMapper {
	export interface Session {
		id: string;
		city: string | null;
		region: string | null;
		timezone: string | null;
		country_code: string | null;
		browser: string | null;
		os: string | null;
	}

	export interface CurrentAndManySessions {
		current_session_id: string;
		sessions: Session[];
	}
}
