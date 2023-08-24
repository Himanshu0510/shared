'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var checkbox = require('primereact/checkbox');
var dialog = require('primereact/dialog');
var button = require('primereact/button');
var datatable = require('primereact/datatable');
var column = require('primereact/column');
var inputtext = require('primereact/inputtext');
var axios = require('axios');
var reactFontawesome = require('@fortawesome/react-fontawesome');
var freeSolidSvgIcons = require('@fortawesome/free-solid-svg-icons');
var splitbutton = require('primereact/splitbutton');
var confirmdialog = require('primereact/confirmdialog');
var entityUtils = require('app/shared/util/entity-utils');
var reactJhipster = require('react-jhipster');
var pagination_constants = require('app/shared/util/pagination.constants');
var store = require('app/config/store');
var jsPDF = require('jspdf');
var autoTable = require('jspdf-autotable');
var radiobutton = require('primereact/radiobutton');
var utils = require('primereact/utils');
var reactHookForm = require('react-hook-form');
var reactstrap = require('reactstrap');
var inputtextarea = require('primereact/inputtextarea');
require('lodash');
var treetable = require('primereact/treetable');
var translation = require('app/shared/translation');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var jsPDF__default = /*#__PURE__*/_interopDefaultLegacy(jsPDF);
var autoTable__default = /*#__PURE__*/_interopDefaultLegacy(autoTable);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const Translate = (prop) => {
    const [selectLanguage, setSelectLanguage] = React__default["default"].useState(sessionStorage.getItem("Language"));
    React__default["default"].useState();
    const [isMandatory, setIsMandatory] = React__default["default"].useState([]);
    React__default["default"].useState();
    const [finalValue, setFinalValue] = React__default["default"].useState();
    React__default["default"].useState(sessionStorage.getItem("menuItemId"));
    React__default["default"].useEffect(() => {
        fetchData();
    }, [""]);
    const fetchData = () => {
        const languageDataLocal = JSON.parse(sessionStorage.getItem("LanguageData"));
        if (languageDataLocal["translations"][selectLanguage][prop.contentKey])
            setFinalValue(languageDataLocal["translations"][selectLanguage][prop.contentKey]["text"]);
        setIsMandatory(languageDataLocal["translations"][selectLanguage][prop.contentKey]);
    };
    return (React__default["default"].createElement(React__default["default"].Fragment, null,
        isMandatory != undefined ? React__default["default"].createElement("span", null,
            isMandatory.text,
            " ") : "",
        isMandatory != undefined ? (isMandatory.mandatory === true ? (React__default["default"].createElement("span", { className: "reqsign" }, "*")) : ("")) : ("")));
};

class Setting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.show,
            columns: this.props.columns,
            filter: this.props.filter,
            gridData: this.props.gridData,
            prop: this.props,
            language: sessionStorage.getItem("Language"),
        };
        this.toggle = (e) => {
            e.preventDefault();
            this.setState({ visible: !this.state.visible });
        };
        this.checkboxChange = (event, index) => {
            const data = this.tableColumns;
            data[index].visible = event.checked;
            this.setState({ columns: data });
        };
        this.footerContent = () => {
            return (React__default["default"].createElement("div", null,
                React__default["default"].createElement(button.Button, { label: "Apply", icon: "pi pi-check", onClick: () => this.handleChange(), autoFocus: true }),
                React__default["default"].createElement(button.Button, { label: "Reset", onClick: () => this.resetSettings() }),
                React__default["default"].createElement(button.Button, { label: "Cancel", icon: "pi pi-times", onClick: () => {
                        this.handleCancel();
                    }, className: "p-button-text" })));
        };
        if (this.state.gridData.length === 0) {
            this.tableColumns = this.state.columns;
        }
        else {
            this.tableColumns = this.state.gridData;
            console.log("Grid Api response");
        }
    }
    getcolumns() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(this.state);
            let data = [];
            const entity = {
                gridId: this.state.prop.gridId,
                gridSettingDetailText: JSON.stringify(this.props.columns),
                menuItemId: sessionStorage.getItem("menuItemId"),
                userMasterId: 1,
                hierarchyLevelId: 352,
                languageId: 1,
            };
            data = yield axios__default["default"].put("api/grid-user-settings/saveUpdateData", entity);
            const dataJson = JSON.parse(data.data.gridSettingDetailText);
            console.log("colom", dataJson);
            // if(dataJson.length == 0 ){
            //   this.tableColumns= this.state.columns
            // }
            // else{
            this.tableColumns = dataJson;
            // }
        });
    }
    componentDidMount() {
        // this.getcolumns();
    }
    handleChange() {
        this.getTabelHeaderData();
        this.props.onSetting(this.tableColumns, this.state.filter);
    }
    handleCancel() {
        this.setState({
            visible: false,
            colums: this.props.columns,
        });
        this.props.onClose();
    }
    // resetSettings() {
    // console.log(this.props);
    // this.setState({
    //   filter: this.props.filter,
    //   columns: this.props.columns,
    // });
    // }
    resetSettings() {
        this.setState({
            visible: this.state.columns.map((e) => (e.visible = true)),
            columns: this.props.columns,
            // columns: this.state.columns.map(e => [{ field: e.field, header: e.header, visible: true }]),
        });
        this.resetFromServer();
    }
    resetFromServer() {
        return __awaiter(this, void 0, void 0, function* () {
            let id;
            if (this.state.language === "en")
                id = 1;
            else if (this.state.language === "hi")
                id = 2;
            else
                id = 3;
            const reset = yield axios__default["default"].delete(`/api/grid-user-settings/deleteByUserIdAndHierarchyIdAndGridIdAndMenuItemId?userMasterId=${1}&languageId=${id}&gridId=${this.state.prop.gridId}`);
            console.log(reset);
        });
    }
    getTabelHeaderData() {
        return __awaiter(this, void 0, void 0, function* () {
            let data1 = [];
            let id;
            if (this.state.language === "en")
                id = 1;
            else if (this.state.language === "hi")
                id = 2;
            else
                id = 3;
            const entity = {
                gridId: String(this.props.gridId),
                gridSettingDetailText: JSON.stringify(this.state.columns),
                menuItemId: sessionStorage.getItem("menuItemId"),
                userMasterId: 1,
                hierarchyLevelId: 1,
                languageId: id,
            };
            data1 = yield axios__default["default"].put("api/grid-user-settings/saveUpdateData", entity, {
                headers: { menuItemId: this.props.gridId },
            });
            const dataJson = JSON.parse(data1.data.gridSettingDetailText);
            console.log(dataJson);
        });
    }
    render() {
        const cellEditor = (options) => {
            return textEditor(options);
        };
        const textEditor = (options) => {
            return (React__default["default"].createElement(inputtext.InputText, { type: "text", value: options.value, onChange: (e) => options.editorCallback(e.target.value) }));
        };
        const onCellEditComplete = (e) => {
            const { rowData, newValue, field, originalEvent: event } = e;
            switch (field) {
                case "quantity":
                default:
                    if (newValue.trim().length > 0)
                        rowData[field] = newValue;
                    else
                        event.preventDefault();
                    break;
            }
        };
        const rowReorder = (e) => {
            // this.tableColumns = null;
            // this.tableColumns = e.value;
            if (this.state.gridData.length === 0) {
                this.setState({ columns: e.value });
                this.tableColumns = this.state.columns;
            }
            else {
                this.setState({ gridData: e.value });
                this.tableColumns = this.state.gridData;
            }
            console.log(e.value);
        };
        return (React__default["default"].createElement(dialog.Dialog, { header: "Settings", 
            //footer={this.footerContent}
            visible: this.state.visible, style: { width: "80vw" }, onHide: () => {
                this.handleCancel();
            }, draggable: false, resizable: false, maximizable: true },
            React__default["default"].createElement("div", null,
                React__default["default"].createElement("div", { className: "modal-content" },
                    React__default["default"].createElement("h4", null,
                        "Filter:",
                        " ",
                        React__default["default"].createElement(checkbox.Checkbox, { onChange: (event) => this.setState({ filter: !this.state.filter }), checked: this.state.filter })),
                    React__default["default"].createElement(datatable.DataTable, { value: this.tableColumns, reorderableRows: true, onRowReorder: (e) => rowReorder(e), responsiveLayout: "scroll", rows: this.tableColumns.length },
                        React__default["default"].createElement(column.Column, { rowReorder: true, style: { width: "3rem" } }),
                        React__default["default"].createElement(column.Column, { field: "header", header: "Columns", editor: (options) => cellEditor(options), onCellEditComplete: onCellEditComplete }),
                        React__default["default"].createElement(column.Column, { field: "width", header: "Width", editor: (options) => cellEditor(options), onCellEditComplete: onCellEditComplete }),
                        React__default["default"].createElement(column.Column, { header: "Display", body: (data, props) => (React__default["default"].createElement("div", null,
                                React__default["default"].createElement(checkbox.Checkbox, { onChange: (event) => this.checkboxChange(event, props.rowIndex), checked: data.visible, disabled: data.field === "documentTypeName" ? true : false }))) }))),
                React__default["default"].createElement("div", { className: "p-dialog-footer" },
                    React__default["default"].createElement(button.Button, { className: "btnStyle btn btn-success", onClick: () => this.handleChange(), autoFocus: true },
                        React__default["default"].createElement(reactFontawesome.FontAwesomeIcon, { icon: freeSolidSvgIcons.faCheck }),
                        " ",
                        React__default["default"].createElement(Translate, { contentKey: "home.apply" })),
                    React__default["default"].createElement(button.Button, { className: "btnStyle btn btn-info", onClick: () => this.resetSettings() },
                        React__default["default"].createElement(reactFontawesome.FontAwesomeIcon, { icon: freeSolidSvgIcons.faRepeat }),
                        " ",
                        React__default["default"].createElement(Translate, { contentKey: "home.reset" })),
                    React__default["default"].createElement(button.Button, { className: "btnStyle btn btn-danger", onClick: () => this.handleCancel() },
                        React__default["default"].createElement(reactFontawesome.FontAwesomeIcon, { icon: "times" }),
                        React__default["default"].createElement(Translate, { contentKey: "home.close" }))))));
    }
}

class ExportSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.show,
            columns: this.props.columns,
            prop: this.props,
        };
        this.toggle = (e) => {
            e.preventDefault();
            this.setState({ visible: !this.state.visible });
        };
        this.checkboxChange = (event, index) => {
            const data = this.state.columns;
            data[index].visible = event.checked;
            this.setState({ columns: data });
        };
        this.state.columns.map((e) => {
            e.visible = true;
        });
    }
    handleChange() {
        this.props.onSetting(this.state.columns);
    }
    handleCancel() {
        this.setState({
            visible: false,
            colums: this.props.columns,
        });
    }
    resetSettings() {
        this.setState({
            columns: this.state.columns.map((e) => (e.visible = true)),
        });
    }
    render() {
        const cellEditor = (options) => {
            return textEditor(options);
        };
        const textEditor = (options) => {
            return (React__default["default"].createElement(inputtext.InputText, { type: "text", value: options.value, onChange: (e) => options.editorCallback(e.target.value) }));
        };
        const onCellEditComplete = (e) => {
            const { rowData, newValue, field, originalEvent: event } = e;
            switch (field) {
                case "quantity":
                default:
                    if (newValue.trim().length > 0)
                        rowData[field] = newValue;
                    else
                        event.preventDefault();
                    break;
            }
        };
        const footerContent = (React__default["default"].createElement("div", null,
            React__default["default"].createElement(button.Button, { label: "Export", icon: "pi pi-check", onClick: () => this.handleChange(), autoFocus: true })));
        return (React__default["default"].createElement(dialog.Dialog, { header: "Exports", footer: footerContent, maximizable: true, visible: this.state.visible, style: { width: "50vw" }, onHide: () => {
                this.handleCancel();
            } },
            React__default["default"].createElement("div", { className: "modal-content" },
                React__default["default"].createElement(datatable.DataTable
                // reorderableRows
                , { 
                    // reorderableRows
                    dataKey: "id", value: this.state.columns, 
                    // onRowReorder={onRowReorder}
                    responsiveLayout: "scroll", rows: this.state.columns.length },
                    React__default["default"].createElement(column.Column, { field: "header", header: "Columns", editor: (options) => cellEditor(options), onCellEditComplete: onCellEditComplete }),
                    React__default["default"].createElement(column.Column, { header: "Display", body: (data, props) => (React__default["default"].createElement("div", null,
                            React__default["default"].createElement(checkbox.Checkbox, { onChange: (event) => this.checkboxChange(event, props.rowIndex), checked: data.visible }))) }))),
            React__default["default"].createElement("div", { className: "p-dialog-footer" },
                React__default["default"].createElement(button.Button, { className: "btnStyle btn btn-success", onClick: () => this.handleChange(), autoFocus: true },
                    React__default["default"].createElement(reactFontawesome.FontAwesomeIcon, { icon: freeSolidSvgIcons.faCheck }),
                    " Export"))));
    }
}

const AskReason = (prop) => {
    const [dataForm, setData] = React.useState(prop.data);
    React.useState("");
    const [visible, setVisible] = React.useState(prop.visible);
    const [action, setAction] = React.useState(prop.action);
    const closeModal = () => {
        setVisible(false);
        prop.onClose();
    };
    React.useEffect(() => {
        console.log(prop);
    });
    const defaultValues = Object.assign(Object.assign({}, dataForm), { reasonForChange: "" });
    const getFormErrorMessage = (name) => {
        return errors[name] ? (React__default["default"].createElement("small", { className: "p-error" }, errors[name].message)) : (React__default["default"].createElement("small", { className: "p-error" }, "\u00A0"));
    };
    const onSubmit = (data) => {
        data.reasonForChange = data.reasonForChange;
        const entity = Object.assign(Object.assign({}, data), { reasonForChange: data.reasonForChange });
        prop.saveWithReason(entity, prop.deleteObject);
        prop.onClose();
    };
    const { control, formState: { errors }, handleSubmit, getValues, reset, } = reactHookForm.useForm({ defaultValues });
    return (React__default["default"].createElement(React__default["default"].Fragment, null,
        React__default["default"].createElement(dialog.Dialog, { header: React__default["default"].createElement(Translate, { contentKey: "reason" }), id: prop.id, visible: visible, onHide: closeModal, style: { width: "30vw" } },
            React__default["default"].createElement("form", { onSubmit: handleSubmit(onSubmit) },
                React__default["default"].createElement("div", { className: "modal-content", style: { overflow: "auto !important" } },
                    React__default["default"].createElement(reactHookForm.Controller, { name: "reasonForChange", control: control, rules: { required: "Reason is required." }, render: ({ field, fieldState }) => (React__default["default"].createElement(React__default["default"].Fragment, null,
                            React__default["default"].createElement("label", null,
                                React__default["default"].createElement(Translate, { contentKey: "reasonForConfirmation" }),
                                " :",
                                " ",
                                React__default["default"].createElement("span", { className: "reqsign" }, "*")),
                            React__default["default"].createElement(inputtextarea.InputTextarea, { id: field.name, value: field.value, className: utils.classNames("form-control", {
                                    "p-invalid": fieldState.error,
                                }), onChange: (e) => field.onChange(e.target.value), rows: 3, cols: 30 }),
                            getFormErrorMessage(field.name))) })),
                React__default["default"].createElement("div", { className: "p-dialog-footer " },
                    React__default["default"].createElement(reactstrap.Button, { label: "Submit", id: "askReason", type: "submit", color: action == "delete" ? "danger" : "primary", className: "btnStyle", icon: "pi pi-check" },
                        action == "delete" ? (React__default["default"].createElement(reactFontawesome.FontAwesomeIcon, { icon: "times" })) : (React__default["default"].createElement(reactFontawesome.FontAwesomeIcon, { icon: "save" })),
                        action == "delete" ? (React__default["default"].createElement(Translate, { contentKey: "delete" })) : (React__default["default"].createElement(Translate, { contentKey: "home.save" }))))))));
};

const Table = (prop) => {
    store.useAppDispatch();
    const menuItemId = sessionStorage.getItem("menuItemId");
    React.useState(sessionStorage.getItem("id"));
    const dt = React.useRef();
    const [reasonFlag, setReasonFlag] = React.useState(false);
    const [data, setData] = React.useState();
    const [column$1, setColumn] = React.useState();
    React.useState([]);
    const [exportCol, setExportCol] = React.useState([]);
    const [filter, setfilter] = React.useState(prop.toggleFilter);
    const [filters, setfilters] = React.useState(prop.filters);
    const [gridId, setGridId] = React.useState(prop.gridId);
    const [apiGridData, setApiGridData] = React.useState([]);
    const [modal, setModal] = React.useState(false);
    const [modalExport, setModalExport] = React.useState(false);
    React.useState(null);
    const [exportType, setExportType] = React.useState();
    React.useState([]);
    const [globalFilterValue, setGlobalFilterValue] = React.useState("");
    const [deleteHeader, setdeleteHeader] = React.useState(React__default["default"].createElement(Translate, { contentKey: "documentType.deleteConfirm" }));
    const [deletemsg, setdeletemsg] = React.useState(React__default["default"].createElement(Translate, { contentKey: "home.deleteMsg" }));
    const [ifShowHeader, setifShowHeader] = React.useState(false);
    const [ifHideHeader, setifHideHeader] = React.useState(true);
    const [language, setlanguage] = React.useState(sessionStorage.getItem("Language"));
    const [redioFilter, setRedioFilter] = React.useState("Active");
    const [redioFilterPublish, setRedioFilterPublish] = React.useState("");
    React.useState(true);
    const [Searchplaceholder, setSearchPlaceholder] = React.useState("Keyword Search");
    React.useState(prop.reasonAskOnCheck ? prop.reasonAskOnCheck : false);
    const [itemsAction, setitemsAction] = React.useState([]);
    const [buttonAction, setButtonAction] = React.useState([]);
    const [selectedItem, setSelectedItem] = React.useState();
    const [hideActionbtn, sethideActionbtn] = React.useState(prop.hideActionbtn ? prop.hideActionbtn : false);
    const [rowReorder, setrowReorder] = React.useState(prop.rowReorder ? prop.rowReorder : false);
    const [actionId, setActionId] = React.useState();
    const [editObject, setEditObject] = React.useState([]);
    const getActionBtn = (id, object) => {
        setActionId(id);
        setEditObject(object);
    };
    React.useEffect(() => {
        const compareJsonjs = document.createElement("script");
        compareJsonjs.src =
            "https://cdn.jsdelivr.net/npm/lodash@4.17.10/lodash.min.js";
        compareJsonjs.async = true;
        document.body.appendChild(compareJsonjs);
    }, []);
    const getGridData = () => __awaiter(void 0, void 0, void 0, function* () {
        let id;
        if (language === "en")
            id = 1;
        else if (language === "hi")
            id = 2;
        else
            id = 3;
        const gridData = yield axios__default["default"].get(`api/grid-user-settings/${gridId}/${id}/${menuItemId}/1`);
        yield setColumn(JSON.parse(gridData.data.gridSettingDetailText).data.length > 0
            ? JSON.parse(gridData.data.gridSettingDetailText).data
            : prop.column);
        yield prepareRowAction(JSON.parse(gridData.data.gridSettingDetailText).data);
    });
    React.useEffect(() => {
        setColumn(prop.column);
    }, [prop.column]);
    React.useEffect(() => {
        setActionId(actionId);
        setEditObject(editObject);
        prepareRowAction(column$1);
    }, [actionId, editObject]);
    React.useEffect(() => {
        setData(prop.data);
        // setitemsAction(prop.actionFlag);
    }, [prop.data]);
    const labelbtnFlag = {
        yes: React__default["default"].createElement(Translate, { contentKey: "yes" }),
        no: React__default["default"].createElement(Translate, { contentKey: "no" }),
        edit: React__default["default"].createElement(Translate, { contentKey: "edit" }),
        delete: React__default["default"].createElement(Translate, { contentKey: "delete" }),
        keySearch: React__default["default"].createElement(Translate, { contentKey: "keywordSearch" }),
        hierarchy: React__default["default"].createElement(Translate, { contentKey: "hierarchy" }),
        export: React__default["default"].createElement(Translate, { contentKey: "export" }),
        activeradio: React__default["default"].createElement(Translate, { contentKey: "activeradio" }),
        allradio: React__default["default"].createElement(Translate, { contentKey: "allradio" }),
        inactiveradio: React__default["default"].createElement(Translate, { contentKey: "inactiveradio" }),
    };
    const prepareRowAction = (actionArr) => {
        let tmpRowAction = [];
        if (actionArr) {
            for (let i = 0; i < actionArr.length; i++) {
                if (actionArr[i]["type"] == "Action") {
                    let actinObj = actionArr[i].actionJson;
                    if (actinObj) {
                        for (let j = 0; j < actinObj.length; j++) {
                            let item = {
                                className: actinObj[j]["className"] != null &&
                                    actinObj[j]["className"] != ""
                                    ? actinObj[j]["className"]
                                    : "icon",
                                label: (React__default["default"].createElement(Translate, { contentKey: actinObj[j]["label"] })),
                                icon: actinObj[j]["icon"],
                                id: actinObj[j]["id"],
                                visible: actinObj[j]["visible"],
                                askReason: actinObj[j]["askReason"],
                                command: () => {
                                    actinObj[j]["id"] == "Delete"
                                        ? deleteConfirmOnAction(actionId, actinObj[j]["askReason"], editObject)
                                        : eval(prop[actinObj[j].command](actionId, gridId, actinObj[j]["askReason"], editObject));
                                },
                            };
                            tmpRowAction.push(item);
                            setitemsAction(tmpRowAction);
                        }
                    }
                }
                if (actionArr[i]["type"] == "Button") {
                    let butonObj = actionArr[i].actionJson;
                    setButtonAction(butonObj);
                }
            }
        }
    };
    React.useEffect(() => {
        setSelectedItem(prop.sendSelectedItem ? prop.sendSelectedItem : "");
        setSelectCheckboxRc(prop.sendSelectedItem);
    }, [prop.sendSelectedItem]);
    React.useEffect(() => {
        getGridData();
        setRedioFilterPublish("All");
        if (!redioFilter) {
            setRedioFilter("Active");
        }
        if (gridId === "dmsClientID" ||
            gridId === "dmsParameterID" ||
            gridId === "ParameterCategoriesID") {
            setifShowHeader(true);
        }
        if (gridId === "documentWorkspaceID") {
            setifHideHeader(false);
        }
        setSearchPlaceholder(String(React__default["default"].createElement(Translate, { contentKey: "export" })));
    }, []);
    const toggle = (e) => {
        setExportType(e);
        setModalExport(true);
    };
    React.useState(entityUtils.overridePaginationStateWithQueryParams(reactJhipster.getSortState(location, pagination_constants.ITEMS_PER_PAGE, "id"), location.search));
    React.useState();
    const edit = (id) => {
        prop.onEdit(id);
        // prop.onEdit(id);
    };
    const items = [
        {
            label: "CSV",
            icon: "fa-solid fa-file-csv",
            command: () => toggle("CSV"),
        },
        {
            label: "Excel",
            icon: "fa-solid fa-file-excel",
            command: () => toggle("EXCEL"),
        },
        {
            label: "PDF",
            icon: "fa-solid fa-file-pdf",
            command: () => toggle("PDF"),
        },
        {
            label: "Json",
            icon: "fa-solid fa-file-arrow-down",
            command: () => exportToJson(),
        },
        { label: "Print", icon: "fa-solid fa-print" },
    ];
    // const [actionId, setActionId] = useState(null);
    // const getActionBtn = id => {
    //   setActionId(id);
    //   prepareRowAction(prop.actionFlag, id);
    // };
    const settingChanges = (coulmnData, filterToggle) => {
        setModal(false);
        setColumn(coulmnData);
        setfilter(filterToggle);
    };
    const settingChangesExport = (coulmnData) => {
        setModalExport(false);
        setExportCol(coulmnData);
        const exportData = data;
        const headers = [];
        coulmnData.map((col) => {
            if (col.visible)
                headers.push(col.field);
        });
        const newData = [];
        exportData.map((element) => {
            const newObj = {};
            headers.forEach((name) => {
                newObj[name] = element[name];
            });
            newData.push(newObj);
        });
        switch (exportType) {
            case "PDF":
                exportPdf(newData, headers, coulmnData);
                break;
            case "EXCEL":
                exportExcel(newData);
                break;
            case "CSV":
                exportCSV(newData);
                break;
        }
    };
    const exportToJson = () => {
        downloadFile({
            body: JSON.stringify(data),
            fileName: "users.json",
            fileType: "text/json",
        });
    };
    const downloadFile = ({ body, fileName, fileType }) => {
        const blob = new Blob([body], { type: fileType });
        const a = document.createElement("a");
        a.download = fileName;
        a.href = window.URL.createObjectURL(blob);
        const clickEvt = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        a.dispatchEvent(clickEvt);
        a.remove();
    };
    const convertToCSV = (objArray) => {
        const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
        let str = "";
        for (let i = 0; i < array.length; i++) {
            let line = "";
            // eslint-disable-next-line guard-for-in
            for (const index in array[i]) {
                if (line !== "")
                    line += ",";
                line += array[i][index];
            }
            str += line + "\r\n";
        }
        return str;
    };
    const exportCSV = (newData, headers) => {
        // Convert Object to JSON
        const jsonObject = JSON.stringify(newData);
        const csv = convertToCSV(jsonObject);
        const exportedFilenmae = "report" + ".csv" ;
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            // feature detection
            // Browsers that support HTML5 download attribute
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    const exportPdf = (newData, headers, coulmnData) => {
        const headerss = coulmnData.map((col) => {
            if (col.visible)
                headers.push({ title: col.header, dataKey: col.field });
        });
        const unit = "pt";
        const size = "A4";
        const orientation = "portrait";
        const doc = new jsPDF__default["default"](orientation, unit, size);
        const title = "Report";
        const content = {
            startY: 50,
            head: headerss,
            body: newData,
        };
        doc.text(title, 40, 40);
        autoTable__default["default"](doc, content);
        doc.save("Task.pdf");
    };
    const exportExcel = (newData) => {
        Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require('xlsx')); }).then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(newData);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });
            saveAsExcelFile(excelBuffer, "products");
        });
    };
    const saveAsExcelFile = (buffer, fileName) => {
        Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require('file-saver')); }).then((module) => {
            if (module && module.default) {
                const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
                const EXCEL_EXTENSION = ".xlsx";
                const dataa = new Blob([buffer], {
                    type: EXCEL_TYPE,
                });
                module.default.saveAs(dataa, fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };
    const closeSettingModal = () => {
        setModal(false);
    };
    const [reasonIdDelete, setReasonIdDelete] = React.useState();
    const deleteConfirmOnAction = (id, flag, record) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(record, "record");
        // setMsgLangKeyInSessionStorage(prop.msgLangKey);
        const idObj = {};
        idObj["id"] = id;
        setReasonIdDelete(idObj);
        confirmdialog.confirmDialog({
            message: deletemsg,
            header: deleteHeader,
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            rejectClassName: "p-button-success",
            acceptLabel: labelbtnFlag.yes ? labelbtnFlag.yes : "Yes",
            rejectLabel: labelbtnFlag.no ? labelbtnFlag.no : "No",
            accept: () => __awaiter(void 0, void 0, void 0, function* () {
                flag == true ? yield setReasonFlag(!reasonFlag) : accept(id, record);
            }),
            reject: () => reject(),
        });
    });
    const reject = () => {
        // toast.warn('You have cancel your delete request.');
    };
    const accept = (data, record) => {
        console.log(record, "record");
        prop.onDelete(data, record);
        setReasonFlag(false);
    };
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        const _filters = Object.assign({}, filters);
        _filters["global"].value = value;
        setfilters(_filters);
        setGlobalFilterValue(value);
        if (gridId === "dmsParameterID") {
            prop.onSearch(value);
        }
    };
    const handleCloseForReason = () => {
        setReasonFlag(!reasonFlag);
        setData(prop.data);
        setSelectCheckboxRc(prop.sendSelectedItem);
    };
    const redioFilterSelection = (name) => {
        setRedioFilter(name);
        sessionStorage.setItem("FilterStatus", name);
        prop.onFilterChanges(name, prop.gridId);
    };
    const [selectCheckboxRc, setSelectCheckboxRc] = React.useState([]);
    React.useState();
    const defaultChecked = (fieldName, data1) => {
        let flag;
        flag = data1[fieldName] ? typeof data1[fieldName] : undefined;
        if (flag != undefined) {
            if (flag == "boolean") {
                return data1[fieldName];
            }
            else if (flag == "string" || flag == "number") {
                let returnValue;
                if (flag == "string") {
                    returnValue = data1[fieldName] == "Yes" ? true : false;
                }
                return returnValue;
            }
            return data1[fieldName];
        }
        else {
            if (selectCheckboxRc != undefined) {
                for (let i = 0; i < selectCheckboxRc.length; i++) {
                    if (selectCheckboxRc[i].id == data1.id) {
                        return true;
                    }
                }
            }
        }
    };
    const radioSelectRecord = (record, fieldName) => {
        prop.radioEvent(record, fieldName);
    };
    const filterColumnGlobal = () => {
        const globalFilterData = [];
        if (column$1) {
            column$1.forEach((element) => {
                if (element.visible)
                    globalFilterData.push(element.field);
            });
        }
        return globalFilterData;
    };
    const onSelectCheckBox = (e, obj) => {
        let selectedItemsArray = selectCheckboxRc != undefined ? [...selectCheckboxRc] : [];
        const checked = e.target.checked;
        // prop.selectCheckbox(checked, e.value, gridId);
        if (e.checked) {
            if (selectedItemsArray.length == 0) {
                selectedItemsArray.push(obj);
            }
            else {
                for (let i = 0; i < selectCheckboxRc.length; i++) {
                    if (obj.id != selectCheckboxRc[i].id || selectCheckboxRc.legth == 0) {
                        selectedItemsArray.push(obj);
                    }
                }
            }
        }
        else
            selectedItemsArray.splice(selectedItemsArray.indexOf(obj), 1);
        setSelectCheckboxRc(selectedItemsArray);
        setReasonIdDelete(obj);
        prop.selectCheckbox(checked, obj, selectedItemsArray);
    };
    return (React__default["default"].createElement("div", null,
        React__default["default"].createElement("div", { className: "d-flex justify-content-between align-items-center" },
            React__default["default"].createElement("div", { className: "d-flex globlFilter" }, filter && (React__default["default"].createElement("span", { className: "p-input-icon-left" },
                React__default["default"].createElement("i", { className: "pi pi-search" }),
                React__default["default"].createElement(inputtext.InputText, { value: globalFilterValue, onChange: (e) => onGlobalFilterChange(e) })))),
            React__default["default"].createElement("div", { className: "d-flex" },
                ifShowHeader && (React__default["default"].createElement(button.Button, { onClick: () => edit(""), className: "btn btn-primary btnStyle", "data-cy": "entityCreateButton" },
                    React__default["default"].createElement(reactFontawesome.FontAwesomeIcon, { icon: "plus" }),
                    "Add")),
                prop.statusFilter === true && (React__default["default"].createElement("span", { className: "d-flex justify-content-center m-r-15 statusFilter" },
                    React__default["default"].createElement("span", { style: { marginLeft: "10px" }, className: "d-flex align-items-center" },
                        React__default["default"].createElement(radiobutton.RadioButton, { inputId: gridId + "gridActive", name: "filter", value: "Active", onChange: (e) => redioFilterSelection(e.value), checked: redioFilter === "Active" }),
                        React__default["default"].createElement("label", { htmlFor: gridId + "gridActive", style: { marginBottom: 0 } }, labelbtnFlag.activeradio
                            ? labelbtnFlag.activeradio
                            : "Active")),
                    React__default["default"].createElement("span", { style: { marginLeft: "10px" }, className: "d-flex align-items-center" },
                        React__default["default"].createElement(radiobutton.RadioButton, { inputId: gridId + "gridInactive", name: "filter", value: "Inactive", onChange: (e) => redioFilterSelection(e.value), checked: redioFilter === "Inactive" }),
                        React__default["default"].createElement("label", { htmlFor: gridId + "gridInactive", style: { marginBottom: 0 } }, labelbtnFlag.inactiveradio
                            ? labelbtnFlag.inactiveradio
                            : "Inactive")),
                    React__default["default"].createElement("span", { style: { marginLeft: "10px" }, className: "d-flex align-items-center" },
                        React__default["default"].createElement(radiobutton.RadioButton, { inputId: gridId + "All", name: "filter", value: "All", onChange: (e) => redioFilterSelection(e.value), checked: redioFilter === "All" }),
                        React__default["default"].createElement("label", { htmlFor: gridId + "All", style: { marginBottom: 0 } }, labelbtnFlag.allradio ? labelbtnFlag.allradio : "All")))),
                React__default["default"].createElement(button.Button, { color: "secondary", className: "iconBtn", onClick: () => {
                        setModal(!modal);
                    }, tooltip: "Setting", tooltipOptions: { position: "top" } },
                    React__default["default"].createElement(reactFontawesome.FontAwesomeIcon, { icon: "cogs" })),
                React__default["default"].createElement(splitbutton.SplitButton, { tooltip: "Export", tooltipOptions: { position: "top" }, label: labelbtnFlag.export ? labelbtnFlag.export : "Export", className: "tableExportMenu", model: items }))),
        modal && (React__default["default"].createElement(Setting, { show: modal, gridId: gridId, gridData: apiGridData, filter: filter, columns: column$1, onClose: closeSettingModal, onSetting: settingChanges })),
        modalExport && (React__default["default"].createElement(ExportSetting, { show: modalExport, columns: column$1, onSetting: settingChangesExport })),
        React__default["default"].createElement("div", { className: "dataTable" },
            React__default["default"].createElement(React__default["default"].Fragment, null,
                data && data.length > 0 ? (React__default["default"].createElement(datatable.DataTable, { ref: dt, sortMode: "multiple", value: data, globalFilterFields: filterColumnGlobal(), filters: filters, 
                    // header={header}
                    filterDisplay: filter ? "row" : "menu", scrollable: true, scrollHeight: "400px", rows: 5, id: gridId, selectionMode: "single", selection: selectedItem, onSelectionChange: (e) => {
                        setSelectedItem(e.value);
                        prop.onSelect ? prop.onSelect(e.value) : {};
                    }, responsiveLayout: "scroll", onRowReorder: (e) => prop.onAddReorderRow(e.value, gridId), reorderableRows: true },
                    rowReorder && React__default["default"].createElement(column.Column, { rowReorder: true, style: { minWidth: "3rem" } }),
                    column$1 &&
                        column$1.map((e, i) => {
                            if (e.visible) {
                                if (e.type === "Radio") {
                                    return (React__default["default"].createElement(column.Column, { header: e.header, body: (data2) => (React__default["default"].createElement(React__default["default"].Fragment, null,
                                            React__default["default"].createElement(radiobutton.RadioButton, { inputId: data2, name: data2.id, value: e.field, onChange: (x) => radioSelectRecord(data2, e.field), checked: data2[e.field] === true }))) }));
                                }
                                if (e.type === "CheckBox") {
                                    return (React__default["default"].createElement(column.Column, { header: e.header, body: (data2) => (React__default["default"].createElement(React__default["default"].Fragment, null,
                                            React__default["default"].createElement(checkbox.Checkbox, { key: Math.random(), name: data2.id, value: e.field, onChange: (e) => {
                                                    onSelectCheckBox(e, data2);
                                                }, checked: defaultChecked(e.field, data2) }))) }));
                                }
                                if (e.type === "Action") {
                                    return (React__default["default"].createElement(column.Column, { header: e.header, body: (data2) => (React__default["default"].createElement(React__default["default"].Fragment, null,
                                            React__default["default"].createElement(splitbutton.SplitButton, { icon: "fa-solid fa-bars", className: "tableActionMenu", model: itemsAction, onFocus: () => getActionBtn(data2.id, data2) }))) }));
                                    //  <Column header="Field Name" body={rowData => <span>Hello</span>} />;
                                }
                                if (e.type === "Button") {
                                    return (React__default["default"].createElement(column.Column, { header: e.header, body: (data2) => (React__default["default"].createElement(React__default["default"].Fragment, null, buttonAction.map((button$1) => (React__default["default"].createElement(React__default["default"].Fragment, null, button$1.visible == true && (React__default["default"].createElement(button.Button, { tooltip: button$1.label, tooltipOptions: { position: "top" }, className: button$1.className + " gridIcon", onClick: () => button$1["id"] == "Delete"
                                                ? deleteConfirmOnAction(data2.id, button$1["askReason"], data2)
                                                : eval(prop[buttonAction[0].command](data2.id, gridId, true, editObject)) },
                                            React__default["default"].createElement("i", { className: button$1.icon })))))))) }));
                                }
                                return (React__default["default"].createElement(column.Column, { key: i, columnKey: e.field, field: e.field, header: e.header, style: { width: e.width }, sortable: true }));
                            }
                            else
                                return null;
                        }),
                    !hideActionbtn && React__default["default"].createElement(React__default["default"].Fragment, null))) : (React__default["default"].createElement("div", { className: "alert alert-warning" }, "No records found")),
                reasonFlag && (React__default["default"].createElement(AskReason, { data: reasonIdDelete, deleteObject: editObject, action: "delete", visible: reasonFlag, saveWithReason: accept, onClose: handleCloseForReason }))))));
};

// import { setMsgLangKeyInSessionStorage } from './validationMethod';
const Treetable = (prop) => {
    //console.log('ddd', prop.data);
    store.useAppDispatch();
    const dt = React.useRef();
    const [data, setData] = React.useState();
    const [nodes, setNodes] = React.useState();
    const [column$1, setColumn] = React.useState(prop.column);
    const [exportCol, setExportCol] = React.useState([]);
    React.useState(prop.documentTypeId);
    const [filter, setfilter] = React.useState(prop.toggleFilter);
    const [filters, setfilters] = React.useState(prop.filters);
    const [gridId, setGridId] = React.useState(prop.gridId);
    const [apiGridData, setApiGridData] = React.useState([]);
    const [modal, setModal] = React.useState(false);
    const [modalExport, setModalExport] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const [exportType, setExportType] = React.useState();
    const [globalFilterValue, setGlobalFilterValue] = React.useState("");
    const [ifShowHeader, setifShowHeader] = React.useState(false);
    const [ifHideHeader, setifHideHeader] = React.useState(true);
    const [language, setlanguage] = React.useState(sessionStorage.getItem("Language"));
    const [redioFilter, setRedioFilter] = React.useState(sessionStorage.getItem("FilterStatus"));
    React.useState(prop.reasonAsk ? prop.reasonAsk : false);
    const menuItemId = sessionStorage.getItem("menuItemId");
    const [deleteHeader, setdeleteHeader] = React.useState(React__default["default"].createElement(translation.Translate, { contentKey: "documentType.deleteConfirm" }));
    const [deletemsg, setdeletemsg] = React.useState(React__default["default"].createElement(translation.Translate, { contentKey: "home.deleteMsg" }));
    const [updatedJson, setUpdatedJson] = React.useState();
    const getGridData = () => __awaiter(void 0, void 0, void 0, function* () {
        let id;
        if (language === "en")
            id = 1;
        else if (language === "hi")
            id = 2;
        else
            id = 3;
        // const menuItemId = gridId;
        const gridData = yield axios__default["default"].get(`api/grid-user-settings/${gridId}/${id}/${menuItemId}/1`);
        yield setColumn(JSON.parse(gridData.data.gridSettingDetailText).data.length > 0
            ? JSON.parse(gridData.data.gridSettingDetailText).data
            : prop.column);
        yield prepareRowAction(JSON.parse(gridData.data.gridSettingDetailText).data);
    });
    React.useEffect(() => {
        setNodes((pre) => {
            if (pre)
                return pre;
            else
                return prop.data;
        });
        setData((pre) => {
            if (pre)
                return pre;
            else
                return prop.data;
        });
    }, [prop.data]);
    React.useEffect(() => {
        getGridData();
        if (!redioFilter) {
            setRedioFilter("Active");
        }
        if (gridId === "dmsClientID" ||
            gridId === "dmsParameterID" ||
            gridId === "ParameterCategoriesID") {
            setifShowHeader(true);
        }
        if (gridId === "documentWorkspaceID") {
            setifHideHeader(false);
        }
    }, []);
    const toggle = (e) => {
        setExportType(e);
        setModalExport(true);
    };
    React.useState(entityUtils.overridePaginationStateWithQueryParams(reactJhipster.getSortState(location, pagination_constants.ITEMS_PER_PAGE, "id"), location.search));
    React.useRef(null);
    const edit = (id) => {
        prop.onEdit(id);
    };
    const save = () => {
        prop.saveJson(nodes);
    };
    const items = [
        {
            label: "CSV",
            icon: "fa-solid fa-file-csv",
            command: () => toggle("CSV"),
        },
        {
            label: "Excel",
            icon: "fa-solid fa-file-excel",
            command: () => toggle("EXCEL"),
        },
        {
            label: "PDF",
            icon: "fa-solid fa-file-pdf",
            command: () => toggle("PDF"),
        },
        {
            label: "Json",
            icon: "fa-solid fa-file-arrow-down",
            command: () => exportToJson(),
        },
        { label: "Print", icon: "fa-solid fa-print" },
    ];
    const settingChanges = (coulmnData, filterToggle) => {
        setModal(false);
        setColumn(coulmnData);
        setfilter(filterToggle);
    };
    const settingChangesExport = (coulmnData) => {
        setModalExport(false);
        setExportCol(coulmnData);
        switch (exportType) {
            case "PDF":
                exportPdf();
                break;
            case "EXCEL":
                exportExcel();
                break;
            case "CSV":
                exportCSV();
                break;
        }
    };
    const exportToJson = () => {
        downloadFile({
            body: JSON.stringify(data),
            fileName: "users.json",
            fileType: "text/json",
        });
    };
    const downloadFile = ({ body, fileName, fileType }) => {
        const blob = new Blob([body], { type: fileType });
        const a = document.createElement("a");
        a.download = fileName;
        a.href = window.URL.createObjectURL(blob);
        const clickEvt = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        a.dispatchEvent(clickEvt);
        a.remove();
    };
    const exportColumns = exportCol.map((col) => {
        if (col.visible)
            ({ title: col.header, dataKey: col.field });
    });
    const exportCSV = React.useCallback(() => {
        dt.current.api.exportDataAsCsv(data);
    }, []);
    const exportPdf = () => {
        const unit = "pt";
        const size = "A4";
        const orientation = "portrait";
        const doc = new jsPDF__default["default"](orientation, unit, size);
        const title = "Report";
        const dataBody = data;
        const headers = exportColumns;
        const content = {
            startY: 50,
            head: headers,
            body: dataBody,
        };
        doc.text(title, 40, 40);
        autoTable__default["default"](doc, content);
        doc.save("Task.pdf");
    };
    const exportExcel = () => {
        Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require('xlsx')); }).then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(data);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });
            saveAsExcelFile(excelBuffer, "products");
        });
    };
    const saveAsExcelFile = (buffer, fileName) => {
        Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require('file-saver')); }).then((module) => {
            if (module && module.default) {
                const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
                const EXCEL_EXTENSION = ".xlsx";
                const dataa = new Blob([buffer], {
                    type: EXCEL_TYPE,
                });
                module.default.saveAs(dataa, fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };
    const getSubDocType = (e) => {
        // console.log("gggg",e);
        setSelectedProduct(e);
        prop.onSelect(e);
    };
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        const _filters = Object.assign({}, filters);
        _filters["global"].value = value;
        setfilters(_filters);
        setGlobalFilterValue(value);
        if (gridId === "dmsParameterID") {
            prop.onSearch(value);
        }
    };
    const closeSettingModal = () => {
        setModal(false);
    };
    const redioFilterSelection = (name) => {
        setRedioFilter(name);
        sessionStorage.setItem("FilterStatus", name);
        prop.onFilterChanges(name);
    };
    var labelbtnFlag = {
        yes: React__default["default"].createElement(translation.Translate, { contentKey: "yes" }),
        no: React__default["default"].createElement(translation.Translate, { contentKey: "no" }),
        edit: React__default["default"].createElement(translation.Translate, { contentKey: "edit" }),
        delete: React__default["default"].createElement(translation.Translate, { contentKey: "delete" }),
        keySearch: React__default["default"].createElement(translation.Translate, { contentKey: "keywordSearch" }),
        hierarchy: React__default["default"].createElement(translation.Translate, { contentKey: "hierarchy" }),
        export: React__default["default"].createElement(translation.Translate, { contentKey: "export" }),
        activeradio: React__default["default"].createElement(translation.Translate, { contentKey: "activeradio" }),
        allradio: React__default["default"].createElement(translation.Translate, { contentKey: "allradio" }),
        inactiveradio: React__default["default"].createElement(translation.Translate, { contentKey: "inactiveradio" }),
    };
    const [itemsAction, setitemsAction] = React.useState([]);
    const [buttonAction, setButtonAction] = React.useState([]);
    const [reasonIdDelete, setReasonIdDelete] = React.useState();
    const [reasonFlag, setReasonFlag] = React.useState(false);
    const deleteConfirmOnAction = (id, reasonFlag) => __awaiter(void 0, void 0, void 0, function* () {
        // setMsgLangKeyInSessionStorage(prop.msgLangKey);
        const idObj = {};
        idObj["id"] = id;
        setReasonIdDelete(idObj);
        confirmdialog.confirmDialog({
            message: deletemsg,
            header: deleteHeader,
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            rejectClassName: "p-button-success",
            acceptLabel: labelbtnFlag.yes ? labelbtnFlag.yes : "Yes",
            rejectLabel: labelbtnFlag.no ? labelbtnFlag.no : "No",
            accept: () => __awaiter(void 0, void 0, void 0, function* () {
                reasonFlag == true ? yield setReasonFlag(!reasonFlag) : accept(id);
            }),
            reject: () => reject(),
        });
    });
    const reject = () => {
        // toast.warn('You have cancel your delete request.');
    };
    const accept = (data) => {
        prop.onDelete(data);
        setReasonFlag(false);
    };
    React.useState();
    React.useState();
    const onEditorValueChange = (options, value) => __awaiter(void 0, void 0, void 0, function* () {
        const newNodes = JSON.parse(JSON.stringify(nodes));
        let indexs = options.rowIndex;
        let typeValue = typeof options.rowIndex;
        console.log("typeValue", typeValue);
        console.log(indexs);
        if (typeValue == "string") {
            indexs = options.rowIndex.split("_");
        }
        let obj = newNodes;
        if (typeof indexs == "number") {
            obj = obj[indexs];
        }
        else {
            for (let idx = 0; idx < indexs.length; idx++) {
                if (idx == 0) {
                    obj = obj[parseInt(indexs[idx])];
                }
                else {
                    obj = obj["children"][parseInt(indexs[idx])];
                }
            }
        }
        obj["data"][options.field] = yield value;
        console.log("value", value, obj["data"][options.field]);
        let finaljson = {};
        yield setNodes(newNodes);
        console.log("newNodes", newNodes);
        finaljson["data"] = [obj];
        setUpdatedJson(finaljson);
        // makeJsonObject(nodes);
    });
    const inputTextEditor = (options) => {
        return (React__default["default"].createElement(inputtext.InputText, { type: "text", value: options.rowData[options.field], onChange: (e) => onEditorValueChange(options, e.target.value) }));
    };
    const [editObject, setEditObject] = React.useState([]);
    const getActionBtn = (id, object) => {
        setActionId(id);
        setEditObject(object);
    };
    const [actionId, setActionId] = React.useState();
    const prepareRowAction = (actionArr) => {
        let tmpRowAction = [];
        if (actionArr) {
            for (let i = 0; i < actionArr.length; i++) {
                if (actionArr[i]["type"] == "Action") {
                    let actinObj = actionArr[i].actionJson;
                    if (actinObj) {
                        for (let j = 0; j < actinObj.length; j++) {
                            let item = {
                                className: actinObj[j]["className"] != null &&
                                    actinObj[j]["className"] != ""
                                    ? actinObj[j]["className"]
                                    : "icon",
                                label: (React__default["default"].createElement(translation.Translate, { contentKey: actinObj[j]["label"] })),
                                icon: actinObj[j]["icon"],
                                id: actinObj[j]["id"],
                                visible: actinObj[j]["visible"],
                                command: () => {
                                    actinObj[j]["id"] == "Delete"
                                        ? deleteConfirmOnAction(actionId, true)
                                        : eval(prop[actinObj[j].command](actionId, gridId, actinObj[j].askReason, editObject));
                                },
                            };
                            tmpRowAction.push(item);
                        }
                        setitemsAction(tmpRowAction);
                    }
                }
                if (actionArr[i]["type"] == "Button") {
                    let butonObj = actionArr[i].actionJson;
                    setButtonAction(butonObj);
                }
            }
        }
    };
    const typeEditor = (options) => {
        return inputTextEditor(options);
    };
    React.useEffect(() => {
        setColumn(prop.column);
    }, [prop.column]);
    React.useEffect(() => {
        setActionId(actionId);
        setEditObject(editObject);
        prepareRowAction(column$1);
    }, [actionId]);
    const defaultChecked = (fieldName, data1) => {
        let flag;
        flag = typeof data1.data[fieldName]
            ? typeof data1.data[fieldName]
            : undefined;
        if (flag != undefined) {
            if (flag == "boolean") {
                return data1.data[fieldName];
            }
            else if (flag == "string" || flag == "number") {
                let returnValue;
                if (flag == "string") {
                    returnValue = data1.data[fieldName] == "Yes" ? true : false;
                }
                return returnValue;
            }
            return data1.data[fieldName];
        }
        else {
            if (selectCheckboxRc != undefined) {
                for (let i = 0; i < selectCheckboxRc.length; i++) {
                    if (selectCheckboxRc[i].id == data1.id) {
                        return true;
                    }
                }
            }
        }
    };
    React.useEffect(() => {
        setData(prop.data);
    }, [prop.data]);
    const handleCloseForReason = () => {
        setReasonFlag(!reasonFlag);
    };
    React.useState();
    const onNodeExpand = (e) => {
        prop.setPid(e.node.data.id);
    };
    const [selectedCategory, setSelectedCategory] = React.useState();
    const [selectCheckboxRc, setSelectCheckboxRc] = React.useState([]);
    const onSelectCheckBox = (e, fieldName, obj) => {
        obj.data[fieldName] = e.target.checked;
        let selectedItemsArray = selectCheckboxRc != undefined ? [...selectCheckboxRc] : [];
        const checked = e.target.checked;
        // prop.selectCheckbox(checked, e.value, gridId);
        if (e.checked) {
            if (selectedItemsArray.length == 0) {
                selectedItemsArray.push(obj);
            }
            else {
                for (let i = 0; i < selectCheckboxRc.length; i++) {
                    if (obj.id != selectCheckboxRc[i].id || selectCheckboxRc.legth == 0) {
                        selectedItemsArray.push(obj);
                    }
                }
            }
        }
        else
            selectedItemsArray.splice(selectedItemsArray.indexOf(obj), 1);
        setSelectCheckboxRc(selectedItemsArray);
        setReasonIdDelete(obj);
        prop.selectCheckbox(checked, obj, selectedItemsArray);
    };
    return (React__default["default"].createElement("div", null,
        ifHideHeader && (React__default["default"].createElement("div", { className: "d-flex justify-content-between align-items-center  " },
            React__default["default"].createElement("div", { className: "d-flex globlFilter" },
                React__default["default"].createElement("span", { className: "p-input-icon-left" },
                    React__default["default"].createElement("i", { className: "pi pi-search" }),
                    React__default["default"].createElement(inputtext.InputText, { value: globalFilterValue, onChange: (e) => onGlobalFilterChange(e), placeholder: "Keyword Search" })),
                React__default["default"].createElement("div", { className: "d-flex" }, prop.title === "doc" && (
                // <span className="d-flex justify-content-center m-r-15 statusFilter">
                React__default["default"].createElement("span", { className: "d-flex justify-content-lg-end align-items-center" },
                    React__default["default"].createElement("span", { style: { marginLeft: "10px" }, className: "d-flex align-items-center" },
                        React__default["default"].createElement(radiobutton.RadioButton, { inputId: "ingredient1", name: "filter", value: "Active", onChange: (e) => redioFilterSelection(e.value), checked: redioFilter === "Active" }),
                        React__default["default"].createElement("label", { htmlFor: "ingredient1", style: { marginBottom: 0 }, className: "ml-2" }, "Active")),
                    React__default["default"].createElement("span", { style: { marginLeft: "10px" }, className: "d-flex align-items-center" },
                        React__default["default"].createElement(radiobutton.RadioButton, { inputId: "ingredient2", name: "filter", value: "Inactive", onChange: (e) => redioFilterSelection(e.value), checked: redioFilter === "Inactive" }),
                        React__default["default"].createElement("label", { htmlFor: "ingredient2", style: { marginBottom: 0 }, className: "ml-2" }, "Inactive")),
                    React__default["default"].createElement("span", { style: { marginLeft: "10px" }, className: "d-flex align-items-center" },
                        React__default["default"].createElement(radiobutton.RadioButton, { inputId: "ingredient3", name: "filter", value: "All", onChange: (e) => redioFilterSelection(e.value), checked: redioFilter === "All" }),
                        React__default["default"].createElement("label", { htmlFor: "ingredient3", style: { marginBottom: 0 }, className: "ml-2" }, "All")))))),
            React__default["default"].createElement("div", { className: "d-flex" },
                ifShowHeader && (React__default["default"].createElement(button.Button, { onClick: () => edit(""), className: "btn btn-primary btnStyle", "data-cy": "entityCreateButton" },
                    React__default["default"].createElement(reactFontawesome.FontAwesomeIcon, { icon: "plus" }),
                    "Add")),
                React__default["default"].createElement(button.Button, { color: "secondary", className: "iconBtn", onClick: () => {
                        setModal(!modal);
                    } },
                    React__default["default"].createElement(reactFontawesome.FontAwesomeIcon, { icon: "cogs" })),
                React__default["default"].createElement(splitbutton.SplitButton, { className: "tableExportMenu", model: items })))),
        modal && (React__default["default"].createElement(Setting, { show: modal, onClose: closeSettingModal, gridId: gridId, gridData: apiGridData, filter: filter, columns: column$1, onSetting: settingChanges })),
        modalExport && (React__default["default"].createElement(ExportSetting, { show: modalExport, columns: column$1, onSetting: settingChangesExport })),
        React__default["default"].createElement("div", { className: "table-responsive" },
            React__default["default"].createElement(React__default["default"].Fragment, null,
                prop.data && prop.data.length > 0 ? (React__default["default"].createElement(treetable.TreeTable, { ref: dt, sortMode: "multiple", value: nodes, filters: filters, 
                    // header={header}
                    rows: 5, id: "table", selectionMode: "single", selectionKeys: selectedProduct, onSelectionChange: (e) => getSubDocType(e.value), onExpand: onNodeExpand, 
                    // onToggle={e => setParentId2(e.value)}
                    className: "mt-4", tableStyle: { minWidth: "50rem" } },
                    React__default["default"].createElement(column.Column, { expander: true }),
                    column$1.map((e, i) => {
                        if (e.visible) {
                            if (e.type === "Radio") {
                                return (React__default["default"].createElement(column.Column, { header: e.header, body: (data2) => (React__default["default"].createElement(React__default["default"].Fragment, null,
                                        React__default["default"].createElement(radiobutton.RadioButton, { inputId: data2, name: data2.id, value: selectedCategory, onChange: (e) => setSelectedCategory(data2), checked: selectedCategory === data2 }))) }));
                            }
                            if (e.type === "CheckBox") {
                                return (React__default["default"].createElement(column.Column, { key: i, header: e.header, body: (data) => (React__default["default"].createElement(checkbox.Checkbox, { key: Math.random(), name: data.id, value: e.field, onChange: (x) => {
                                            onSelectCheckBox(x, e.field, data);
                                        }, checked: defaultChecked(e.field, data) })
                                    // <input
                                    //   key={Math.random()}
                                    //   type="checkbox"
                                    //   onChange={ele => {
                                    //     data.data.checkBoxSelected = ele.target.checked;
                                    //   }}
                                    //   defaultChecked={data.data.checkBoxSelected}
                                    //   style={{ width: '15px', height: '15px' }}
                                    // />
                                    ) }));
                            }
                            if (e.type === "Action") {
                                return (React__default["default"].createElement(column.Column, { header: e.header, body: (data2) => (React__default["default"].createElement(React__default["default"].Fragment, null,
                                        React__default["default"].createElement(splitbutton.SplitButton, { icon: "fa-solid fa-bars", className: "tableActionMenu", model: itemsAction, onFocus: () => getActionBtn(data2.data.id, data2.data) }))) }));
                                //  <Column header="Field Name" body={rowData => <span>Hello</span>} />;
                            }
                            if (e.type === "Button") {
                                return (React__default["default"].createElement(column.Column, { header: e.header, body: (data2) => (React__default["default"].createElement(React__default["default"].Fragment, null, buttonAction.map((button$1) => (React__default["default"].createElement(React__default["default"].Fragment, null, button$1.visible == true && (React__default["default"].createElement(button.Button, { tooltip: button$1.label, tooltipOptions: { position: "top" }, className: button$1.className + " gridIcon", onClick: () => button$1["id"] == "Delete"
                                            ? deleteConfirmOnAction(data2.id, button$1["askReason"])
                                            : eval(prop[buttonAction[0].command](data2.id, gridId, true, editObject)) },
                                        React__default["default"].createElement("i", { className: button$1.icon })))))))) }));
                            }
                            if (e.editable == true) {
                                return (React__default["default"].createElement(column.Column, { key: i, field: e.field, header: e.header, editor: typeEditor, expander: e.expander, sortable: true }));
                            }
                            else {
                                return (React__default["default"].createElement(column.Column, { key: i, field: e.field, header: e.header, expander: e.expander, sortable: true }));
                            }
                            // return <Column key={i} field={e.field} header={e.header} editor={typeEditor} expander={e.expander} sortable />;
                        }
                        else
                            return null;
                    }))) : (React__default["default"].createElement("div", { className: "alert alert-warning" },
                    React__default["default"].createElement(translation.Translate, { contentKey: "home.notFound" }, "No records found"))),
                reasonFlag && (React__default["default"].createElement(AskReason, { data: reasonIdDelete, action: "delete", visible: reasonFlag, saveWithReason: accept, onClose: handleCloseForReason }))),
            prop.flag && (React__default["default"].createElement("div", { className: "p-dialog-footer" },
                React__default["default"].createElement(button.Button, { color: "primary", id: "save-entity", className: "btnStyle", onClick: save, "data-cy": "entityCreateSaveButton" },
                    React__default["default"].createElement(reactFontawesome.FontAwesomeIcon, { icon: "save" }),
                    "Save"))))));
};

exports.AskReason = AskReason;
exports.ExportSetting = ExportSetting;
exports.Setting = Setting;
exports.Table = Table;
exports.Translate = Translate;
exports.Treetable = Treetable;
//# sourceMappingURL=index.js.map
