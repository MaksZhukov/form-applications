exports.id = 486;
exports.ids = [486];
exports.modules = {

/***/ 13878:
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 13878;
module.exports = webpackEmptyContext;

/***/ }),

/***/ 71515:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  j: () => (/* binding */ initialize)
});

// EXTERNAL MODULE: ./node_modules/mysql2/index.js
var mysql2 = __webpack_require__(39169);
// EXTERNAL MODULE: ./node_modules/mysql2/promise.js
var promise = __webpack_require__(98294);
// EXTERNAL MODULE: external "sequelize"
var external_sequelize_ = __webpack_require__(90496);
;// CONCATENATED MODULE: ./src/db/application/schema.ts

const applicationSchema = {
    id: {
        type: external_sequelize_.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    createdAt: external_sequelize_.DataTypes.DATE,
    updatedAt: external_sequelize_.DataTypes.DATE,
    title: {
        type: external_sequelize_.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: external_sequelize_.DataTypes.STRING,
        allowNull: false
    },
    deadline: {
        type: external_sequelize_.DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
    },
    phone: {
        type: external_sequelize_.DataTypes.STRING,
        defaultValue: ""
    },
    comment: {
        type: external_sequelize_.DataTypes.STRING,
        defaultValue: ""
    },
    name: {
        type: external_sequelize_.DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: external_sequelize_.DataTypes.ENUM("в обработке", "в работе", "выполнено"),
        allowNull: false
    },
    email: {
        type: external_sequelize_.DataTypes.STRING,
        allowNull: false
    },
    isUrgent: {
        type: external_sequelize_.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isArchived: {
        type: external_sequelize_.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
};

;// CONCATENATED MODULE: ./src/db/files/schema.ts

const fileSchema = {
    id: {
        type: external_sequelize_.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    createdAt: external_sequelize_.DataTypes.DATE,
    updatedAt: external_sequelize_.DataTypes.DATE,
    name: {
        type: external_sequelize_.DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: external_sequelize_.DataTypes.STRING,
        allowNull: false
    }
};

;// CONCATENATED MODULE: ./src/db/organization/schema.ts

const organizationSchema = {
    id: {
        type: external_sequelize_.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    createdAt: external_sequelize_.DataTypes.DATE,
    updatedAt: external_sequelize_.DataTypes.DATE,
    name: {
        type: external_sequelize_.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    uid: {
        type: external_sequelize_.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: external_sequelize_.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: external_sequelize_.DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: external_sequelize_.DataTypes.STRING,
        defaultValue: ""
    },
    role: {
        type: external_sequelize_.DataTypes.ENUM("admin", "regular"),
        allowNull: false
    }
};

;// CONCATENATED MODULE: ./src/db/index.ts






let OrganizationModel;
let ApplicationModel;
let FileModel;
let sequelize;
const initialize = async ()=>{
    if (sequelize) {
        return {
            OrganizationModel,
            ApplicationModel,
            FileModel
        };
    }
    const connection = await promise.createConnection({
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_USER_PASSWORD
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE}\`;`);
    sequelize = new external_sequelize_.Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_USER_PASSWORD, {
        dialect: "mysql",
        dialectModule: mysql2,
        omitNull: true
    });
    OrganizationModel = sequelize.define("organization", organizationSchema);
    ApplicationModel = sequelize.define("application", applicationSchema);
    ApplicationModel.belongsTo(OrganizationModel);
    FileModel = sequelize.define("file", fileSchema);
    FileModel.belongsTo(ApplicationModel);
    // await sequelize.sync({ alter: true });
    return {
        OrganizationModel,
        ApplicationModel,
        FileModel
    };
};


/***/ })

};
;