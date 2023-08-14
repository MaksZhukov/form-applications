"use strict";
exports.id = 337;
exports.ids = [337];
exports.modules = {

/***/ 95435:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   W: () => (/* binding */ createApplication),
/* harmony export */   s: () => (/* binding */ fetchApplications)
/* harmony export */ });
/* harmony import */ var query_string__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(47339);
/* harmony import */ var _client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(24205);


const fetchApplications = (offset = 1, status, organizationId)=>_client__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.get(`/api/applications?${query_string__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.stringify({
        offset,
        status,
        organizationId
    })}`);
const createApplication = (data)=>_client__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.post(`/api/applications`, data);


/***/ }),

/***/ 24763:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ fetchOrganization)
/* harmony export */ });
/* harmony import */ var _client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24205);

const fetchOrganization = ()=>_client__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.get(`/api/organization`).then((res)=>res.data);


/***/ }),

/***/ 62982:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Y: () => (/* binding */ createOrganization),
/* harmony export */   Z: () => (/* binding */ fetchOrganizations)
/* harmony export */ });
/* harmony import */ var _client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24205);

const fetchOrganizations = ()=>_client__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.get(`/api/organizations`);
const createOrganization = (data)=>_client__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.post(`/api/organizations`, data);


/***/ }),

/***/ 68338:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Z: () => (/* reexport */ Layout_Layout)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: ./src/app/api/client.ts
var client = __webpack_require__(24205);
;// CONCATENATED MODULE: ./src/app/api/logout/index.ts

const logout = ()=>client/* default */.Z.post(`/api/logout`);

// EXTERNAL MODULE: ./src/app/api/organization/index.ts
var organization = __webpack_require__(24763);
// EXTERNAL MODULE: ./src/app/api/organizations/index.ts
var organizations = __webpack_require__(62982);
// EXTERNAL MODULE: ./src/app/localStorage.ts
var localStorage = __webpack_require__(96182);
// EXTERNAL MODULE: ./node_modules/@material-tailwind/react/index.js
var react = __webpack_require__(1275);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/lib/useQuery.mjs + 6 modules
var useQuery = __webpack_require__(53993);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/lib/useMutation.mjs + 1 modules
var useMutation = __webpack_require__(30012);
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(52451);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
// EXTERNAL MODULE: ./node_modules/next/navigation.js
var navigation = __webpack_require__(57114);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
;// CONCATENATED MODULE: ./src/app/components/Layout/Layout.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 









const Layout = ({ children })=>{
    const router = (0,navigation.useRouter)();
    const [showModal, setShowModal] = (0,react_.useState)(false);
    const { data, error, isError, isLoading } = (0,useQuery/* useQuery */.a)({
        queryKey: [
            "user",
            (0,localStorage/* getLoginTime */.n)()
        ],
        staleTime: Infinity,
        retry: 0,
        queryFn: organization/* fetchOrganization */.A
    });
    const { mutateAsync } = (0,useMutation/* useMutation */.D)({
        mutationFn: ()=>logout()
    });
    const createOrganizationMutation = (0,useMutation/* useMutation */.D)(organizations/* createOrganization */.Y);
    (0,react_.useEffect)(()=>{
        //@ts-expect-error error
        if (error?.response.status === 401) {
            handleLogout();
        }
    }, [
        error
    ]);
    const handleClickLogo = ()=>{
        router.push("/");
    };
    const handleLogout = async ()=>{
        try {
            await mutateAsync();
        } catch (err) {}
        router.push("/login");
    };
    const handleClickAdd = ()=>{
        setShowModal(true);
    };
    const handleCancel = ()=>{
        setShowModal(false);
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const formData = new FormData(e.target);
        await createOrganizationMutation.mutateAsync(formData);
        alert("Организация добавлена");
        setShowModal(false);
    };
    if (isLoading || isError) {
        return /*#__PURE__*/ jsx_runtime_.jsx("div", {
            className: "container flex items-center h-screen mx-auto py-4",
            children: /*#__PURE__*/ jsx_runtime_.jsx(react.Spinner, {
                className: "h-12 w-12 mx-auto"
            })
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("header", {
                className: "fixed w-full bg-white py-4 z-10",
                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: "container flex justify-between mx-auto",
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                            onClick: handleClickLogo,
                            className: "cursor-pointer",
                            src: "/logo.png",
                            width: 300,
                            height: 29,
                            alt: "Logo"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("span", {
                            className: "flex items-center",
                            children: [
                                "Добро пожаловать",
                                /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                    className: "text-accent font-bold pl-2",
                                    children: data?.data.email
                                }),
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)(react.Menu, {
                                    placement: "bottom-end",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx(react.MenuHandler, {
                                            children: /*#__PURE__*/ jsx_runtime_.jsx(react.Button, {
                                                size: "sm",
                                                className: "ml-1 p-2 border-accent text-accent",
                                                variant: "outlined",
                                                children: "меню"
                                            })
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)(react.MenuList, {
                                            children: [
                                                data.data.role === "admin" && /*#__PURE__*/ jsx_runtime_.jsx(react.MenuItem, {
                                                    onClick: handleClickAdd,
                                                    children: "Добавить организацию"
                                                }),
                                                /*#__PURE__*/ jsx_runtime_.jsx(react.MenuItem, {
                                                    onClick: handleLogout,
                                                    children: "Выход"
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                " "
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "container mx-auto pt-20 pb-10",
                children: children
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("footer", {
                className: "p-10 border-t-accent border-t"
            }),
            showModal && /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none",
                        children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "relative w-auto my-6 mx-auto max-w-3xl",
                            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("form", {
                                onSubmit: handleSubmit,
                                className: "border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: "flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t",
                                        children: /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                            className: "text-3xl font-semibold",
                                            children: "Добавление организации"
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                        className: "relative p-6 flex-auto",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ jsx_runtime_.jsx(react.Typography, {
                                                        children: "Email"
                                                    }),
                                                    /*#__PURE__*/ jsx_runtime_.jsx("input", {
                                                        type: "text",
                                                        className: "flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none",
                                                        name: "email",
                                                        required: true
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ jsx_runtime_.jsx(react.Typography, {
                                                        children: "Пароль"
                                                    }),
                                                    /*#__PURE__*/ jsx_runtime_.jsx("input", {
                                                        type: "text",
                                                        className: "flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none",
                                                        name: "password",
                                                        required: true
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ jsx_runtime_.jsx(react.Typography, {
                                                        children: "Название организации"
                                                    }),
                                                    /*#__PURE__*/ jsx_runtime_.jsx("input", {
                                                        type: "text",
                                                        className: "flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none",
                                                        name: "name",
                                                        required: true
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ jsx_runtime_.jsx(react.Typography, {
                                                        children: "УНП"
                                                    }),
                                                    /*#__PURE__*/ jsx_runtime_.jsx("input", {
                                                        type: "text",
                                                        className: "flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none",
                                                        name: "uid",
                                                        required: true
                                                    })
                                                ]
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                        className: "flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b",
                                        children: [
                                            /*#__PURE__*/ jsx_runtime_.jsx(react.Button, {
                                                onClick: handleCancel,
                                                size: "sm",
                                                className: "ml-1 p-2 border-accent text-accent",
                                                variant: "outlined",
                                                children: "Отмена"
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx(react.Button, {
                                                type: "submit",
                                                size: "sm",
                                                className: "ml-1 p-2 border-accent text-accent",
                                                variant: "outlined",
                                                children: "Добавить"
                                            })
                                        ]
                                    })
                                ]
                            })
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "opacity-25 fixed inset-0 z-40 bg-black"
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const Layout_Layout = (Layout);

;// CONCATENATED MODULE: ./src/app/components/Layout/index.ts



/***/ })

};
;