"use strict";
exports.id = 823;
exports.ids = [823];
exports.modules = {

/***/ 59425:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   U: () => (/* binding */ fetchApplication),
/* harmony export */   l: () => (/* binding */ updateApplication)
/* harmony export */ });
/* harmony import */ var _client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24205);

const fetchApplication = (id)=>_client__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.get(`/api/applications/${id}`).then((res)=>res.data);
const updateApplication = (params)=>_client__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.put(`/api/applications/${params.id}`, params.data).then((res)=>res.data);


/***/ }),

/***/ 52823:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Z: () => (/* reexport */ Application_Application)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: ./src/app/api/applications/index.ts
var applications = __webpack_require__(95435);
// EXTERNAL MODULE: ./src/app/api/applications/[id]/index.ts
var _id_ = __webpack_require__(59425);
// EXTERNAL MODULE: ./src/app/api/client.ts
var client = __webpack_require__(24205);
;// CONCATENATED MODULE: ./src/app/api/files/index.ts

const getFiles = (applicationId)=>client/* default */.Z.get(`/api/files`, {
        params: {
            applicationId
        }
    }).then((res)=>res.data);
const uploadFiles = (params)=>client/* default */.Z.post(`/api/files`, params.data, {
        params: {
            applicationId: params.applicationId
        }
    }).then((res)=>res.data);

// EXTERNAL MODULE: ./src/app/api/organization/index.ts
var organization = __webpack_require__(24763);
// EXTERNAL MODULE: ./src/app/api/organizations/index.ts
var api_organizations = __webpack_require__(62982);
// EXTERNAL MODULE: ./src/app/localStorage.ts
var localStorage = __webpack_require__(96182);
;// CONCATENATED MODULE: ./src/icons/BlankIcon.tsx

const BlankIcon = (props)=>/*#__PURE__*/ jsx_runtime_.jsx("svg", {
        className: props.className,
        color: "gray",
        style: {
            fontSize: props.fontSize,
            width: "1em",
            height: "1em",
            verticalAlign: "middle",
            fill: "currentColor",
            overflow: "hidden"
        },
        viewBox: "0 0 1024 1024",
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg",
        children: /*#__PURE__*/ jsx_runtime_.jsx("path", {
            d: "M642 82H162v860h700V302L642 82z m20 76.6L785.4 282H662V158.6zM822 902H202V122h420v200h200v580z"
        })
    });
/* harmony default export */ const icons_BlankIcon = (BlankIcon);

// EXTERNAL MODULE: ./node_modules/@material-tailwind/react/index.js
var react = __webpack_require__(1275);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/lib/useQuery.mjs + 6 modules
var useQuery = __webpack_require__(53993);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/lib/QueryClientProvider.mjs
var QueryClientProvider = __webpack_require__(212);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/lib/useMutation.mjs + 1 modules
var useMutation = __webpack_require__(30012);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(11440);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
;// CONCATENATED MODULE: ./src/app/components/Application/Application.tsx
"user client";












const Application = ({ data, newApplicationId, onCancel, onUpdated })=>{
    const { data: organizationData, isSuccess } = (0,useQuery/* useQuery */.a)([
        "user",
        (0,localStorage/* getLoginTime */.n)()
    ], {
        staleTime: Infinity,
        retry: 0,
        queryFn: organization/* fetchOrganization */.A
    });
    const isAdmin = organizationData?.data.role === "admin";
    const { data: organizations } = (0,useQuery/* useQuery */.a)({
        queryKey: [
            "users",
            (0,localStorage/* getLoginTime */.n)()
        ],
        staleTime: Infinity,
        enabled: isAdmin,
        retry: 0,
        queryFn: ()=>(0,api_organizations/* fetchOrganizations */.Z)()
    });
    const { data: files } = (0,useQuery/* useQuery */.a)({
        queryKey: [
            "files",
            data?.id
        ],
        queryFn: ()=>getFiles(data?.id),
        staleTime: Infinity,
        retry: 0,
        enabled: !!data?.id
    });
    const client = (0,QueryClientProvider/* useQueryClient */.NL)();
    const ref = (0,react_.useRef)(null);
    const inputFileRef = (0,react_.useRef)(null);
    const updateApplicationMutation = (0,useMutation/* useMutation */.D)(_id_/* updateApplication */.l);
    const uploadFilesMutation = (0,useMutation/* useMutation */.D)(uploadFiles);
    const createApplicationMutation = (0,useMutation/* useMutation */.D)(applications/* createApplication */.W);
    const disabledEdit = isAdmin ? false : !data ? false : data?.status !== "в обработке";
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (ref.current) {
            const formData = new FormData(ref.current);
            let applicationId = data?.id;
            if (isAdmin && data || data?.status === "в обработке") {
                const { data: updatedData } = await updateApplicationMutation.mutateAsync({
                    id: data.id,
                    data: formData
                });
                if (onUpdated) {
                    onUpdated(updatedData);
                }
            } else if (!data) {
                const { data: { data: createApplication } } = await createApplicationMutation.mutateAsync(formData);
                applicationId = createApplication.id;
            }
            if (inputFileRef.current?.files?.length) {
                const formDataFiles = new FormData();
                for(let i = 0; i < inputFileRef.current.files.length; i++){
                    const file = inputFileRef.current.files[i];
                    formDataFiles.append("files", file, file.name);
                    const { data: uploadedFiles } = await uploadFilesMutation.mutateAsync({
                        applicationId: applicationId,
                        data: formDataFiles
                    });
                    if (files) {
                        client.setQueryData([
                            "files",
                            data?.id
                        ], (prev)=>prev ? {
                                ...prev,
                                data: [
                                    ...prev.data,
                                    ...uploadedFiles
                                ]
                            } : undefined);
                    }
                }
                inputFileRef.current.value = "";
            }
            if (!data) {
                onCancel();
            }
            client.refetchQueries({
                queryKey: [
                    "application",
                    (0,localStorage/* getLoginTime */.n)(),
                    1
                ]
            });
        }
    };
    const handleClickFile = ()=>{
        inputFileRef.current?.click();
    };
    const renderPinnedFiles = /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(react.Typography, {
                children: "Прикрепленные файлы:"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                children: files?.data.map((item, index)=>/*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                        className: "font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3",
                        href: `/api/files/${item.name}`,
                        children: [
                            "Файл ",
                            index + 1
                        ]
                    }, item.id))
            })
        ]
    });
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("form", {
        ref: ref,
        onSubmit: handleSubmit,
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "flex mb-5",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "flex mr-20",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx(react.Typography, {
                                className: "mr-10",
                                children: "№"
                            }),
                            " ",
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("span", {
                                className: "border-b border-black",
                                children: [
                                    "AM-",
                                    (data?.id || newApplicationId || 0).toString().padStart(6, "0")
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "flex",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx(react.Typography, {
                                className: "mr-10",
                                children: "Дата создания"
                            }),
                            " ",
                            /*#__PURE__*/ jsx_runtime_.jsx("input", {
                                readOnly: true,
                                defaultValue: data?.createdAt ? new Date(data?.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "flex mb-5 gap-10",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "flex flex-1 justify-between",
                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            className: "flex items-center",
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx(react.Typography, {
                                    className: "w-56",
                                    children: "Статус"
                                }),
                                " ",
                                isAdmin ? /*#__PURE__*/ (0,jsx_runtime_.jsxs)("select", {
                                    defaultValue: data?.status,
                                    name: "status",
                                    className: "flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx("option", {
                                            value: "в обработке",
                                            selected: true,
                                            children: "В обработке"
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("option", {
                                            value: "в работе",
                                            children: "В работе"
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("option", {
                                            value: "выполнена",
                                            children: "Выполнена"
                                        })
                                    ]
                                }) : /*#__PURE__*/ jsx_runtime_.jsx("input", {
                                    readOnly: true,
                                    name: "status",
                                    defaultValue: data?.status || "в обработке"
                                })
                            ]
                        })
                    }),
                    isAdmin && organizations && /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "flex flex-1 items-center",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx(react.Typography, {
                                className: "w-56",
                                children: "Организация"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("select", {
                                required: true,
                                defaultValue: organizations.data.data.find((item)=>item.name === data?.organization.name)?.id,
                                name: "organizationUserId",
                                className: "mt-1 border h-full border-gray-300 text-sm rounded-lg block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none",
                                children: organizations.data.data.map((item)=>/*#__PURE__*/ jsx_runtime_.jsx("option", {
                                        value: item.id,
                                        children: item.name
                                    }, item.id))
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "flex items-center",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx(react.Typography, {
                                className: "mr-2",
                                children: "Срочная задача"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("input", {
                                type: "checkbox",
                                name: "isUrgent",
                                defaultChecked: data?.isUrgent
                            })
                        ]
                    }),
                    isAdmin && /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "flex items-center",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx(react.Typography, {
                                className: "mr-2",
                                children: "Добавить в архив"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("input", {
                                type: "checkbox",
                                name: "isArchived",
                                defaultChecked: data?.isArchived
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "flex mb-5",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(react.Typography, {
                        className: "w-56",
                        children: "Наименование*"
                    }),
                    " ",
                    /*#__PURE__*/ jsx_runtime_.jsx("input", {
                        type: "text",
                        disabled: disabledEdit,
                        defaultValue: data?.title,
                        className: "flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none",
                        name: "title",
                        required: true
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "flex mb-5",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(react.Typography, {
                        className: "w-56",
                        children: "Описание*"
                    }),
                    " ",
                    /*#__PURE__*/ jsx_runtime_.jsx("textarea", {
                        name: "description",
                        defaultValue: data?.description,
                        required: true,
                        disabled: disabledEdit,
                        rows: 4,
                        className: "flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "flex mb-5",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(react.Typography, {
                        className: "w-56",
                        children: "Имя*"
                    }),
                    " ",
                    /*#__PURE__*/ jsx_runtime_.jsx("input", {
                        type: "text",
                        disabled: disabledEdit,
                        className: "flex-0.5 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none",
                        name: "name",
                        defaultValue: data?.name,
                        required: true
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "flex mb-5",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(react.Typography, {
                        className: "w-56",
                        children: "Телефон*"
                    }),
                    " ",
                    /*#__PURE__*/ jsx_runtime_.jsx("input", {
                        type: "text",
                        disabled: disabledEdit,
                        className: "flex-0.5 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none",
                        name: "phone",
                        defaultValue: data?.phone,
                        required: true
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "flex mb-5",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(react.Typography, {
                        className: "w-56",
                        children: "Email"
                    }),
                    " ",
                    /*#__PURE__*/ jsx_runtime_.jsx("input", {
                        type: "text",
                        disabled: disabledEdit,
                        className: "flex-0.5 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none",
                        name: "email",
                        defaultValue: data?.email
                    })
                ]
            }),
            isAdmin && /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "flex mb-5",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(react.Typography, {
                        className: "w-56",
                        children: "Срок выполнения*"
                    }),
                    " ",
                    /*#__PURE__*/ jsx_runtime_.jsx("input", {
                        type: "text",
                        placeholder: "11.11.2011",
                        disabled: disabledEdit,
                        className: "flex-0.25 border-b border-black text-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none",
                        name: "deadline",
                        defaultValue: data?.deadline ? new Date(data?.deadline).toLocaleDateString() : "",
                        required: true
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "w-3/4",
                children: /*#__PURE__*/ jsx_runtime_.jsx("textarea", {
                    name: "comment",
                    placeholder: "Комментарий",
                    defaultValue: data?.comment,
                    disabled: disabledEdit,
                    rows: 4,
                    className: "flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "flex justify-end items-center mt-4",
                children: [
                    files?.data && data?.status !== "в обработке" ? renderPinnedFiles : /*#__PURE__*/ jsx_runtime_.jsx(jsx_runtime_.Fragment, {
                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)(react.Typography, {
                                            className: "mr-4",
                                            children: [
                                                "Прикрепить файлы(до ",
                                                10 - (files?.data.length || 0),
                                                ")"
                                            ]
                                        }),
                                        " ",
                                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                            onClick: handleClickFile,
                                            className: "inline-block p-1 rounded-full border-gray-500 border",
                                            children: [
                                                /*#__PURE__*/ jsx_runtime_.jsx(icons_BlankIcon, {
                                                    className: "text-gray-500",
                                                    fontSize: 25
                                                }),
                                                /*#__PURE__*/ jsx_runtime_.jsx("input", {
                                                    ref: inputFileRef,
                                                    className: "hidden",
                                                    accept: ".jpg, .png, .jpeg, .rar, .zip, .docx, .pdf",
                                                    type: "file",
                                                    max: 10 - (files?.data.length || 0),
                                                    multiple: true
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                files?.data && renderPinnedFiles
                            ]
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "flex-1"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(react.Button, {
                        variant: "text",
                        color: "gray",
                        className: "mr-1",
                        onClick: onCancel,
                        children: data ? "Вернуться" : "Отмена"
                    }),
                    !data ? /*#__PURE__*/ jsx_runtime_.jsx(react.Button, {
                        variant: "outlined",
                        className: "border-accent text-accent",
                        type: "submit",
                        children: "Отправить задачу"
                    }) : isAdmin || data.status === "в обработке" ? /*#__PURE__*/ jsx_runtime_.jsx(react.Button, {
                        variant: "outlined",
                        className: "border-accent text-accent",
                        type: "submit",
                        children: "Обновить задачу"
                    }) : null
                ]
            })
        ]
    });
};
/* harmony default export */ const Application_Application = (Application);

;// CONCATENATED MODULE: ./src/app/components/Application/index.ts



/***/ })

};
;