"use strict";
(() => {
var exports = {};
exports.id = 322;
exports.ids = [322];
exports.modules = {

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

/***/ 10049:
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

// NAMESPACE OBJECT: ./src/app/api/logout/route.ts
var route_namespaceObject = {};
__webpack_require__.r(route_namespaceObject);
__webpack_require__.d(route_namespaceObject, {
  POST: () => (POST)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/node-polyfill-headers.js
var node_polyfill_headers = __webpack_require__(42394);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-route/module.js
var app_route_module = __webpack_require__(69692);
var module_default = /*#__PURE__*/__webpack_require__.n(app_route_module);
// EXTERNAL MODULE: ./src/db/index.ts + 3 modules
var db = __webpack_require__(71515);
// EXTERNAL MODULE: ./src/services/jwt/index.ts
var jwt = __webpack_require__(41322);
// EXTERNAL MODULE: ./node_modules/next/dist/server/web/exports/next-response.js
var next_response = __webpack_require__(89335);
;// CONCATENATED MODULE: ./src/app/api/logout/route.ts



async function POST(request) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
        return new next_response/* default */.Z("no token for logout", {
            status: 400
        });
    }
    try {
        const { payload: { id } } = await (0,jwt/* verify */.T)(token);
        const { OrganizationModel } = await (0,db/* initialize */.j)();
        await OrganizationModel.update({
            token: ""
        }, {
            where: {
                id: id
            }
        });
        const response = new next_response/* default */.Z();
        response.cookies.delete("token");
        return response;
    } catch (err) {
        return new next_response/* default */.Z("error with updating user and deleting token", {
            status: 500
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Fapi%2Flogout%2Froute&name=app%2Fapi%2Flogout%2Froute&pagePath=private-next-app-dir%2Fapi%2Flogout%2Froute.ts&appDir=C%3A%5CUsers%5Cmaks_%5CDesktop%5Cform-applications%5Csrc%5Capp&appPaths=%2Fapi%2Flogout%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!

    

    

    

    const options = {"definition":{"kind":"APP_ROUTE","page":"/api/logout/route","pathname":"/api/logout","filename":"route","bundlePath":"app/api/logout/route"},"resolvedPagePath":"C:\\Users\\maks_\\Desktop\\form-applications\\src\\app\\api\\logout\\route.ts","nextConfigOutput":""}
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

    const originalPathname = "/api/logout/route"

    

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
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [697,501,368,100,486], () => (__webpack_exec__(10049)));
module.exports = __webpack_exports__;

})();