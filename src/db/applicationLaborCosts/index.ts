import { Sequelize } from 'sequelize';
import { ApplicationLaborCostsModel } from './model';
import { applicationLaborCostsSchema } from './schema';

export const initApplicationLaborCostsModel = async (sequelize: Sequelize) => {
	ApplicationLaborCostsModel.init(applicationLaborCostsSchema, {
		sequelize,
		modelName: 'application_labor_costs',
		timestamps: false
	});
	await ApplicationLaborCostsModel.sync({ alter: true });
};
