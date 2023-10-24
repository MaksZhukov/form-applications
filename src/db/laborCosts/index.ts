import { Sequelize } from 'sequelize';
import { laborCostsSchema } from './schema';
import { LaborCostsModel } from './model';
import { ApplicationModel } from '../application/model';
import { ApplicationLaborCostsModel } from '../applicationLaborCosts/model';
import { UserModel } from '../users/model';
import { KindsOfWorkModel } from '../kindsOfWork/model';

export const initLaborCostsModel = async (sequelize: Sequelize) => {
	LaborCostsModel.init(laborCostsSchema, { sequelize, modelName: 'labor_costs' });
	LaborCostsModel.belongsTo(UserModel, {
		foreignKey: 'employeeId',
		as: 'employee'
	});
	LaborCostsModel.belongsTo(KindsOfWorkModel, { as: 'kindsOfWork' });

	LaborCostsModel.belongsToMany(ApplicationModel, {
		through: ApplicationLaborCostsModel,
		onDelete: 'CASCADE'
	});
	ApplicationModel.belongsToMany(LaborCostsModel, {
		through: ApplicationLaborCostsModel,
		as: { plural: 'LaborCosts', singular: 'LaborCost' },
		onDelete: 'CASCADE'
	});

	LaborCostsModel.sync({ alter: true });
	ApplicationModel.sync({ alter: true });
};
