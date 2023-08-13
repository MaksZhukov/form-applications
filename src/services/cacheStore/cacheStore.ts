export const cacheStore = new Map();
export const setDataToCacheStore = (key: string, data: any) => {
	if (cacheStore.size > 1000) {
		cacheStore.clear();
	}
	cacheStore.set(key, data);
};

export const clearCacheByKey = (key: string) => cacheStore.set(key, undefined);

export const getDataFromCacheStore = (key: string) => cacheStore.get(key);
