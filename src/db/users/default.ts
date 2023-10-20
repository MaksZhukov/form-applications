import { OrganizationModel } from '../organization/model';
import { UserModel } from './model';
import bcrypt from 'bcrypt';

export const createDefaultUser = async (organization: OrganizationModel) => {
	return await UserModel.findOrCreate({
		where: { email: 'admin@mail.ru' },
		defaults: {
			email: 'admin@mail.ru',
			name: 'admin',
            departmentName: 'Admin department',
			organizationId: organization.dataValues.id,
			password: await bcrypt.hash(process.env.DEFAULT_USER_ADMIN_PASS, +process.env.BCRYPT_SALT),
			role: 'admin'
		}
	});
};
