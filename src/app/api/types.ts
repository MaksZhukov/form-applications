export type ApiResponse<T> = {
	data: T;
	meta?: {
		total: number;
	};
};

export type ApplicationType = 'common' | 'internal';
