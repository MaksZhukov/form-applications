namespace NodeJS {
	interface ProcessEnv {
		DATABASE_HOST: string;
		DATABASE_PORT: number;
		DATABASE: string;
		DATABASE_USER: string;
		DATABASE_USER_PASSWORD: string;
		BCRYPT_SALT: string;
		WS_PORT: number;
		NEXT_PUBLIC_WS_HOST: string;
		NEXT_PUBLIC_FF_COMMENTS: string;
	}
}
