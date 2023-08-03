export type ApiResponse<T> = {
	data: T;
	meta: {
		offset: number;
		limit: number;
		total: number;
	};
};
