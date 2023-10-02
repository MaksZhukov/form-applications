import { OrganizationModel } from './model';

export const createDefaultOrganization = async () => {
	const [organization] = await OrganizationModel.findOrCreate({
		where: { name: 'Default' },
		defaults: { name: 'Default', uid: '00000000' }
	});
	return organization;
};
