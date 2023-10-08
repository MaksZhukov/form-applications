require('dotenv').config();

module.exports = {
	development: {
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_USER_PASSWORD,
		database: process.env.DATABASE,
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT,
		dialect: 'mysql',
		dialectOptions: {
			bigNumberStrings: true
		}
	},
	test: {
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_USER_PASSWORD,
		database: process.env.DATABASE,
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT,
		dialect: 'mysql',
		dialectOptions: {
			bigNumberStrings: true
		}
	},
	production: {
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_USER_PASSWORD,
		database: process.env.DATABASE,
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT,
		dialect: 'mysql',
		dialectOptions: {
			bigNumberStrings: true
		}
	}
};
