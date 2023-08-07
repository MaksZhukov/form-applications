export const getTemplateEqual = (data: { [key: string]: string | number }, delimiter = 'and') =>
	Object.keys(data).reduce(
		(prev, curr, i, arr) => prev + `${curr}=? ${i !== arr.length - 1 ? `${delimiter} ` : ''}`,
		''
	);

export const getTemplateValues = (data: { [key: string]: string | number }) =>
	Object.keys(data).map((key) => `${data[key]}`);
