import { OrganizationModel } from './model';

export const createDefaultOrganization = async () => {
	const [organization] = await OrganizationModel.findOrCreate({
		where: { name: 'Default' }
	});
	return organization;
};
