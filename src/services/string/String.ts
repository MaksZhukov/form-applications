
export const parseCookie = <T extends { [key: string]: string }>(cookie: string = ''): T =>
	cookie
		.split(';')
		.map((v) => v.split('='))
		.reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {} as T);