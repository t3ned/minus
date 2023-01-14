import { Snowflake } from "@t3ned/snowflake";

// 2022-01-01T00:00:00.000Z UTC
const SNOWFLAKE_EPOCH = 1640995200000n;

export const snowflake = new Snowflake() //
	.setEpoch(SNOWFLAKE_EPOCH)
	.setWorkerId(0n)
	.setProcessId(1n);
