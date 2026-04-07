import type { Config } from '@react-router/dev/config';

export default {
	appDirectory: './src/app',
	ssr: true,
	// prerender: ['/*?'], // CRITICAL: Leave disabled. PostgreSQL connection pool keeps the build hanging indefinitely if enabled.
} satisfies Config;
