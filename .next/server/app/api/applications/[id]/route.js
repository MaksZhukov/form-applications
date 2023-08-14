"use strict";
(() => {
var exports = {};
exports.id = 689;
exports.ids = [689];
exports.modules = {

/***/ 86069:
/***/ ((module) => {

module.exports = require("lodash/isNil");

/***/ }),

/***/ 66011:
/***/ ((module) => {

module.exports = require("lodash/omitBy");

/***/ }),

/***/ 90496:
/***/ ((module) => {

module.exports = require("sequelize");

/***/ }),

/***/ 14300:
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ 6113:
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ 82361:
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ 13685:
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ 95687:
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ 41808:
/***/ ((module) => {

module.exports = require("net");

/***/ }),

/***/ 22037:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 77282:
/***/ ((module) => {

module.exports = require("process");

/***/ }),

/***/ 12781:
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ 71576:
/***/ ((module) => {

module.exports = require("string_decoder");

/***/ }),

/***/ 39512:
/***/ ((module) => {

module.exports = require("timers");

/***/ }),

/***/ 24404:
/***/ ((module) => {

module.exports = require("tls");

/***/ }),

/***/ 57310:
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ 73837:
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ 59796:
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ 2525:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  headerHooks: () => (/* binding */ headerHooks),
  originalPathname: () => (/* binding */ originalPathname),
  requestAsyncStorage: () => (/* binding */ requestAsyncStorage),
  routeModule: () => (/* binding */ routeModule),
  serverHooks: () => (/* binding */ serverHooks),
  staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),
  staticGenerationBailout: () => (/* binding */ staticGenerationBailout)
});

// NAMESPACE OBJECT: ./src/app/api/applications/[id]/route.ts
var route_namespaceObject = {};
__webpack_require__.r(route_namespaceObject);
__webpack_require__.d(route_namespaceObject, {
  GET: () => (GET),
  PUT: () => (PUT)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/node-polyfill-headers.js
var node_polyfill_headers = __webpack_require__(42394);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-route/module.js
var app_route_module = __webpack_require__(69692);
var module_default = /*#__PURE__*/__webpack_require__.n(app_route_module);
// EXTERNAL MODULE: ./src/app/constants.ts
var constants = __webpack_require__(11807);
// EXTERNAL MODULE: ./src/db/index.ts + 3 modules
var db = __webpack_require__(71515);
// EXTERNAL MODULE: ./src/services/jwt/index.ts
var jwt = __webpack_require__(41322);
// EXTERNAL MODULE: external "lodash/isNil"
var isNil_ = __webpack_require__(86069);
var isNil_default = /*#__PURE__*/__webpack_require__.n(isNil_);
// EXTERNAL MODULE: external "lodash/omitBy"
var omitBy_ = __webpack_require__(66011);
var omitBy_default = /*#__PURE__*/__webpack_require__.n(omitBy_);
// EXTERNAL MODULE: ./node_modules/next/dist/server/web/exports/next-response.js
var next_response = __webpack_require__(89335);
;// CONCATENATED MODULE: ./src/app/api/applications/[id]/route.ts






async function GET(request) {
    const id = parseInt(request.nextUrl.pathname.split("/")[3]);
    const token = request.cookies.get("token")?.value;
    try {
        const { payload: { id: orgId, role } } = await (0,jwt/* verify */.T)(token);
        const { ApplicationModel, OrganizationModel } = await (0,db/* initialize */.j)();
        const data = await ApplicationModel.findOne({
            where: role === "admin" ? {
                id
            } : {
                id,
                organizationId: orgId
            },
            include: {
                model: OrganizationModel,
                attributes: [
                    "id",
                    "name",
                    "email"
                ]
            }
        });
        if (data) {
            const result = {
                data
            };
            return next_response/* default */.Z.json(result);
        } else {
            return new next_response/* default */.Z(`not found`, {
                status: 400
            });
        }
    } catch (err) {
        //@ts-expect-error error
        return new next_response/* default */.Z(`Error getting applications: ${err.message}`, {
            status: 500
        });
    }
}
async function PUT(request) {
    const token = request.cookies.get("token")?.value;
    const id = parseInt(request.nextUrl.pathname.split("/")[3]);
    const formData = await request.formData();
    const title = formData.get("title");
    const status = formData.get("status");
    const description = formData.get("description");
    const deadline = formData.get("deadline");
    const phone = formData.get("phone");
    const comment = formData.get("comment");
    const name = formData.get("name");
    const email = formData.get("email");
    const isUrgent = formData.get("isUrgent");
    const isArchived = formData.get("isArchived");
    if (!title || !description || !phone || !name) {
        return new next_response/* default */.Z("required fields", {
            status: 400
        });
    }
    if (deadline && !deadline.match(constants/* DATE_PATTERN */.y)) {
        return new next_response/* default */.Z("validate fields", {
            status: 400
        });
    }
    const { payload: { id: orgId } } = await (0,jwt/* verify */.T)(token);
    const { ApplicationModel, OrganizationModel } = await (0,db/* initialize */.j)();
    try {
        await ApplicationModel.update(omitBy_default()({
            title,
            description,
            deadline,
            phone,
            comment,
            status,
            isArchived: Boolean(isArchived),
            name,
            isUrgent: Boolean(isUrgent),
            email
        }, (isNil_default())), {
            where: {
                id,
                organizationId: orgId
            }
        });
        const data = await ApplicationModel.findByPk(id, {
            include: {
                model: OrganizationModel,
                attributes: [
                    "id",
                    "uid",
                    "name",
                    "email"
                ]
            }
        });
        return next_response/* default */.Z.json({
            data
        });
    } catch (err) {
        if (err instanceof Error) {
            return new next_response/* default */.Z(`Error with updating application: ${err.message}`, {
                status: 500
            });
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Fapi%2Fapplications%2F%5Bid%5D%2Froute&name=app%2Fapi%2Fapplications%2F%5Bid%5D%2Froute&pagePath=private-next-app-dir%2Fapi%2Fapplications%2F%5Bid%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cmaks_%5CDesktop%5Cform-applications%5Csrc%5Capp&appPaths=%2Fapi%2Fapplications%2F%5Bid%5D%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!

    

    

    

    const options = {"definition":{"kind":"APP_ROUTE","page":"/api/applications/[id]/route","pathname":"/api/applications/[id]","filename":"route","bundlePath":"app/api/applications/[id]/route"},"resolvedPagePath":"C:\\Users\\maks_\\Desktop\\form-applications\\src\\app\\api\\applications\\[id]\\route.ts","nextConfigOutput":""}
    const routeModule = new (module_default())({
      ...options,
      userland: route_namespaceObject,
    })

    // Pull out the exports that we need to expose from the module. This should
    // be eliminated when we've moved the other routes to the new format. These
    // are used to hook into the route.
    const {
      requestAsyncStorage,
      staticGenerationAsyncStorage,
      serverHooks,
      headerHooks,
      staticGenerationBailout
    } = routeModule

    const originalPathname = "/api/applications/[id]/route"

    

/***/ }),

/***/ 11807:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   y: () => (/* binding */ DATE_PATTERN)
/* harmony export */ });
const DATE_PATTERN = /^(0?[1-9]|[12][0-9]|3[01])[\.\-](0?[1-9]|1[012])[\.\-]\d{4}$/;


/***/ }),

/***/ 41322:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   T: () => (/* binding */ verify),
/* harmony export */   Xx: () => (/* binding */ sign)
/* harmony export */ });
/* unused harmony export getBearerToken */
/* harmony import */ var jose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(96100);

const sign = (data)=>new jose__WEBPACK_IMPORTED_MODULE_0__/* .SignJWT */ .N6(data).setExpirationTime("30d").setProtectedHeader({
        alg: "HS256",
        typ: "JWT"
    }).sign(new TextEncoder().encode(process.env.JWT_SECRET));
const verify = (token)=>(0,jose__WEBPACK_IMPORTED_MODULE_0__/* .jwtVerify */ ._f)(token, new TextEncoder().encode(process.env.JWT_SECRET));
const getBearerToken = (request)=>request.headers.get("authorization")?.split(" ")[1];


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [697,501,368,100,486], () => (__webpack_exec__(2525)));
module.exports = __webpack_exports__;

})();