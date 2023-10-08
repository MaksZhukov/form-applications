export const matchPath = (pattern: string, path: string) => {
	const patternArray = pattern.split('/');
	const pathArray = path.split('/');
	return (
		patternArray.length === pathArray.length &&
		patternArray.every((item, index) => {
			return item.startsWith(':') && pathArray[index] ? true : item === pathArray[index];
		})
	);
};
