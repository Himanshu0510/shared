import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  Children,
} from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { overridePaginationStateWithQueryParams } from "app/shared/util/entity-utils";
import { getSortState } from "react-jhipster";
import { ITEMS_PER_PAGE } from "app/shared/util/pagination.constants";
import { useAppDispatch } from "app/config/store";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Setting from "../Setting";
import ExportSetting from "../Export-Column";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { TreeTable } from "primereact/treetable";

import { MenuItem } from "primereact/menuitem";
import { SplitButton } from "primereact/splitbutton";
import { Translate } from "app/shared/translation";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";

import AskReason from "../Ask_Reason";
// import { setMsgLangKeyInSessionStorage } from './validationMethod';
const Treetable = (prop: any) => {
  //console.log('ddd', prop.data);
  const dispatch = useAppDispatch();
  const dt = useRef<any>();
  const [data, setData] = useState<any>();
  const [nodes, setNodes] = useState<any>();
  const [column, setColumn] = useState(prop.column);
  const [exportCol, setExportCol] = useState<any>([]);
  const [documentTypeId, setdocumentypeId] = useState(prop.documentTypeId);
  const [filter, setfilter] = useState(prop.toggleFilter);
  const [filters, setfilters] = useState(prop.filters);
  const [gridId, setGridId] = useState(prop.gridId);
  const [apiGridData, setApiGridData] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalExport, setModalExport] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [exportType, setExportType] = useState();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [ifShowHeader, setifShowHeader] = useState(false);
  const [ifHideHeader, setifHideHeader] = useState(true);

  const [language, setlanguage] = useState(sessionStorage.getItem("Language"));
  const [redioFilter, setRedioFilter] = useState(
    sessionStorage.getItem("FilterStatus")
  );
  const [configurableReason, setConfigurableReason] = useState<boolean>(
    prop.reasonAsk ? prop.reasonAsk : false
  );
  const menuItemId = sessionStorage.getItem("menuItemId");
  const [deleteHeader, setdeleteHeader] = useState(
    <Translate contentKey="documentType.deleteConfirm"></Translate>
  );
  const [deletemsg, setdeletemsg] = useState(
    <Translate contentKey="home.deleteMsg"></Translate>
  );
  const [updatedJson, setUpdatedJson] = useState<any>();
  const finalObject = [];
  const getGridData = async () => {
    let id;
    if (language === "en") id = 1;
    else if (language === "hi") id = 2;
    else id = 3;
    // const menuItemId = gridId;
    const gridData = await axios.get(
      `api/grid-user-settings/${gridId}/${id}/${menuItemId}/1`
    );
    await setColumn(
      JSON.parse(gridData.data.gridSettingDetailText).data.length > 0
        ? JSON.parse(gridData.data.gridSettingDetailText).data
        : prop.column
    );
    await prepareRowAction(
      JSON.parse(gridData.data.gridSettingDetailText).data
    );
  };

  useEffect(() => {
    setNodes((pre: any) => {
      if (pre) return pre;
      else return prop.data;
    });
    setData((pre: any) => {
      if (pre) return pre;
      else return prop.data;
    });
  }, [prop.data]);

  useEffect(() => {
    getGridData();
    if (!redioFilter) {
      setRedioFilter("Active");
    }
    if (
      gridId === "dmsClientID" ||
      gridId === "dmsParameterID" ||
      gridId === "ParameterCategoriesID"
    ) {
      setifShowHeader(true);
    }
    if (gridId === "documentWorkspaceID") {
      setifHideHeader(false);
    }
  }, []);

  const toggle = (e: any) => {
    setExportType(e);
    setModalExport(true);
  };

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(
      getSortState(location, ITEMS_PER_PAGE, "id"),
      location.search
    )
  );
  const toast = useRef(null);
  const edit = (id: any) => {
    prop.onEdit(id);
  };
  const editSub = (id: any) => {
    prop.subTemp(id);
  };

  const preview = (id: any) => {
    prop.onPreview("true");
  };
  const save = () => {
    prop.saveJson(nodes);
  };
  const handleLoadMore = () => {
    if ((window as any).pageYOffset > 0) {
      setPaginationState({
        ...paginationState,
        activePage: paginationState.activePage + 1,
      });
    }
  };

  const items: MenuItem[] = [
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

  const settingChanges = (coulmnData: any, filterToggle: any) => {
    setModal(false);
    setColumn(coulmnData);
    setfilter(filterToggle);
  };
  const settingChangesExport = (coulmnData: any) => {
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
      default:
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
    if (col.visible) ({ title: col.header, dataKey: col.field });
  });
  const exportCSV = useCallback(() => {
    dt.current.api.exportDataAsCsv(data);
  }, []);
  const exportPdf = () => {
    const unit = "pt";
    const size = "A4";
    const orientation = "portrait";
    const doc = new jsPDF(orientation, unit, size);
    const title = "Report";
    const dataBody = data;
    const headers = exportColumns;
    const content = {
      startY: 50,
      head: headers,
      body: dataBody,
    };

    doc.text(title, 40, 40);
    autoTable(doc, content);
    doc.save("Task.pdf");
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "products");
    });
  };
  const saveAsExcelFile = (buffer: any, fileName: any) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        const EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const EXCEL_EXTENSION = ".xlsx";
        const dataa = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          dataa,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  const getSubDocType = (e: any) => {
    // console.log("gggg",e);

    setSelectedProduct(e);
    prop.onSelect(e);
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };

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
  const getBoolean = (id: any) => {
    const field: any = document.querySelector("#" + id);
    return !!field.checked;
  };
  const redioFilterSelection = (name: any) => {
    setRedioFilter(name);
    sessionStorage.setItem("FilterStatus", name);
    prop.onFilterChanges(name);
  };

  var labelbtnFlag: any = {
    yes: <Translate contentKey="yes"></Translate>,
    no: <Translate contentKey="no"></Translate>,
    edit: <Translate contentKey="edit"></Translate>,
    delete: <Translate contentKey="delete"></Translate>,
    keySearch: <Translate contentKey="keywordSearch"></Translate>,
    hierarchy: <Translate contentKey="hierarchy"></Translate>,
    export: <Translate contentKey="export"></Translate>,
    activeradio: <Translate contentKey="activeradio"></Translate>,
    allradio: <Translate contentKey="allradio"></Translate>,
    inactiveradio: <Translate contentKey="inactiveradio"></Translate>,
  };
  const [itemsAction, setitemsAction] = useState<any>([]);
  const [buttonAction, setButtonAction] = useState<any>([]);
  const [reasonIdDelete, setReasonIdDelete] = useState<any>();
  const [reasonFlag, setReasonFlag] = useState<boolean>(false);
  const deleteConfirmOnAction = async (id: number, reasonFlag: boolean) => {
    // setMsgLangKeyInSessionStorage(prop.msgLangKey);
    const idObj: any = {};
    idObj["id"] = id;
    setReasonIdDelete(idObj);
    confirmDialog({
      message: deletemsg,
      header: deleteHeader,
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      rejectClassName: "p-button-success",
      acceptLabel: labelbtnFlag.yes ? labelbtnFlag.yes : "Yes",
      rejectLabel: labelbtnFlag.no ? labelbtnFlag.no : "No",
      accept: async () => {
        reasonFlag == true ? await setReasonFlag(!reasonFlag) : accept(id);
      },
      reject: () => reject(),
    });
  };
  const reject = () => {
    // toast.warn('You have cancel your delete request.');
  };
  const accept = (data: any) => {
    prop.onDelete(data);
    setReasonFlag(false);
  };
  const revice = (id: number) => {
    confirmDialog({
      message: "Are you sure you want to revise this Template?",
      header: "Revise Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      rejectClassName: "p-button-success",
      accept: () => acceptRevice(id),
      reject: () => rejectRevice(),
    });
  };
  const rejectRevice = () => {
    toast.current.show({
      severity: "warn",
      summary: "Rejected",
      detail: "You have rejected",
      life: 3000,
    });
  };
  const acceptRevice = (id: any) => {
    // prop.onDelete(id);
    prop.onRevice(id);
  };
  const [newData, setNewData] = useState<any>();
  const [newNodeValue, setNewNodeValue] = useState<any>();
  const onEditorValueChange = async (options: any, value: any) => {
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
    } else {
      for (let idx = 0; idx < indexs.length; idx++) {
        if (idx == 0) {
          obj = obj[parseInt(indexs[idx])];
        } else {
          obj = obj["children"][parseInt(indexs[idx])];
        }
      }
    }

    obj["data"][options.field] = await value;
    console.log("value", value, obj["data"][options.field]);
    let finaljson: any = {};

    await setNodes(newNodes);
    console.log("newNodes", newNodes);
    finaljson["data"] = [obj];

    setUpdatedJson(finaljson);
    // makeJsonObject(nodes);
  };

  const findNodeByKey = (nodes: any, key: any) => {
    let path = [];
    path = key.toString().split("-");

    let node;

    while (path.length) {
      const list: any = node ? node.children : nodes;
      node = list;
      path.shift();
    }

    return node;
  };
  const inputTextEditor = (options: any) => {
    return (
      <InputText
        type="text"
        value={options.rowData[options.field]}
        onChange={(e: any) => onEditorValueChange(options, e.target.value)}
      />
    );
  };
  const [editObject, setEditObject] = useState<any>([]);
  const getActionBtn = (id: any, object: any) => {
    setActionId(id);
    setEditObject(object);
  };

  const [actionId, setActionId] = useState<number>();
  const prepareRowAction = (actionArr: any[]) => {
    let tmpRowAction = [];
    if (actionArr) {
      for (let i = 0; i < actionArr.length; i++) {
        if (actionArr[i]["type"] == "Action") {
          let actinObj = actionArr[i].actionJson;
          if (actinObj) {
            for (let j = 0; j < actinObj.length; j++) {
              let item = {
                className:
                  actinObj[j]["className"] != null &&
                  actinObj[j]["className"] != ""
                    ? actinObj[j]["className"]
                    : "icon",
                label: (
                  <Translate contentKey={actinObj[j]["label"]}></Translate>
                ),
                icon: actinObj[j]["icon"],
                id: actinObj[j]["id"],
                visible: actinObj[j]["visible"],
                command: () => {
                  actinObj[j]["id"] == "Delete"
                    ? deleteConfirmOnAction(actionId, true)
                    : eval(
                        prop[actinObj[j].command](
                          actionId,
                          gridId,
                          actinObj[j].askReason,
                          editObject
                        )
                      );
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
  const typeEditor = (options: any) => {
    return inputTextEditor(options);
  };
  useEffect(() => {
    setColumn(prop.column);
  }, [prop.column]);

  useEffect(() => {
    setActionId(actionId);
    setEditObject(editObject);
    prepareRowAction(column);
  }, [actionId]);

  const defaultChecked = (fieldName: any, data1: any) => {
    let flag: any;

    flag = typeof data1.data[fieldName]
      ? typeof data1.data[fieldName]
      : undefined;

    if (flag != undefined) {
      if (flag == "boolean") {
        return data1.data[fieldName];
      } else if (flag == "string" || flag == "number") {
        let returnValue: boolean;
        if (flag == "number") {
          // returnValue = parseFloat(data1[fieldName]);
        }
        if (flag == "string") {
          returnValue = data1.data[fieldName] == "Yes" ? true : false;
        }
        return returnValue;
      }

      return data1.data[fieldName];
    } else {
      if (selectCheckboxRc != undefined) {
        for (let i = 0; i < selectCheckboxRc.length; i++) {
          if (selectCheckboxRc[i].id == data1.id) {
            return true;
          } else {
            false;
          }
        }
      }
    }
  };
  useEffect(() => {
    setData(prop.data);
  }, [prop.data]);
  const getParentId = (id: any, levelId: any) => {
    prop.setParentId(id);
    prop.setLevelId(levelId);
  };

  const toggleEdit = (id: any, levelId: any) => {
    prop.setEditId(id);
    prop.setLevelId(levelId);
  };
  const handleCloseForReason = () => {
    setReasonFlag(!reasonFlag);
  };

  const [pid, setPid] = useState<any>();
  const onNodeExpand = (e: any) => {
    prop.setPid(e.node.data.id);
  };
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [selectCheckboxRc, setSelectCheckboxRc] = useState<any>([]);
  const onSelectCheckBox = (e: any, fieldName: any, obj: any) => {
    obj.data[fieldName] = e.target.checked;

    let selectedItemsArray: any =
      selectCheckboxRc != undefined ? [...selectCheckboxRc] : [];
    const checked = e.target.checked;
    // prop.selectCheckbox(checked, e.value, gridId);

    if (e.checked) {
      if (selectedItemsArray.length == 0) {
        selectedItemsArray.push(obj);
      } else {
        for (let i = 0; i < selectCheckboxRc.length; i++) {
          if (obj.id != selectCheckboxRc[i].id || selectCheckboxRc.legth == 0) {
            selectedItemsArray.push(obj);
          }
        }
      }
    } else selectedItemsArray.splice(selectedItemsArray.indexOf(obj), 1);
    setSelectCheckboxRc(selectedItemsArray);
    setReasonIdDelete(obj);
    prop.selectCheckbox(checked, obj, selectedItemsArray);
  };

  return (
    <div>
      {ifHideHeader && (
        <div className="d-flex justify-content-between align-items-center  ">
          {
            <div className="d-flex globlFilter">
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  value={globalFilterValue}
                  onChange={(e) => onGlobalFilterChange(e)}
                  placeholder="Keyword Search"
                />
              </span>
              <div className="d-flex">
                {prop.title === "doc" && (
                  // <span className="d-flex justify-content-center m-r-15 statusFilter">
                  <span className="d-flex justify-content-lg-end align-items-center">
                    <span
                      style={{ marginLeft: "10px" }}
                      className="d-flex align-items-center"
                    >
                      <RadioButton
                        inputId="ingredient1"
                        name="filter"
                        value="Active"
                        onChange={(e) => redioFilterSelection(e.value)}
                        checked={redioFilter === "Active"}
                      />
                      <label
                        htmlFor="ingredient1"
                        style={{ marginBottom: 0 }}
                        className="ml-2"
                      >
                        Active
                      </label>
                    </span>
                    <span
                      style={{ marginLeft: "10px" }}
                      className="d-flex align-items-center"
                    >
                      <RadioButton
                        inputId="ingredient2"
                        name="filter"
                        value="Inactive"
                        onChange={(e) => redioFilterSelection(e.value)}
                        checked={redioFilter === "Inactive"}
                      />
                      <label
                        htmlFor="ingredient2"
                        style={{ marginBottom: 0 }}
                        className="ml-2"
                      >
                        Inactive
                      </label>
                    </span>
                    <span
                      style={{ marginLeft: "10px" }}
                      className="d-flex align-items-center"
                    >
                      <RadioButton
                        inputId="ingredient3"
                        name="filter"
                        value="All"
                        onChange={(e) => redioFilterSelection(e.value)}
                        checked={redioFilter === "All"}
                      />
                      <label
                        htmlFor="ingredient3"
                        style={{ marginBottom: 0 }}
                        className="ml-2"
                      >
                        All
                      </label>
                    </span>
                  </span>
                )}
              </div>
            </div>
          }
          <div className="d-flex">
            {ifShowHeader && (
              <Button
                onClick={() => edit("")}
                className="btn btn-primary btnStyle"
                data-cy="entityCreateButton"
              >
                <FontAwesomeIcon icon="plus" />
                Add
              </Button>
            )}
            <Button
              color="secondary"
              className="iconBtn"
              onClick={() => {
                setModal(!modal);
              }}
            >
              <FontAwesomeIcon icon="cogs" />
            </Button>
            <SplitButton className="tableExportMenu" model={items} />
          </div>
        </div>
      )}
      {modal && (
        <Setting
          show={modal}
          onClose={closeSettingModal}
          gridId={gridId}
          gridData={apiGridData}
          filter={filter}
          columns={column}
          onSetting={settingChanges}
        />
      )}

      {modalExport && (
        <ExportSetting
          show={modalExport}
          columns={column}
          onSetting={settingChangesExport}
        />
      )}
      <div className="table-responsive">
        <>
          {prop.data && prop.data.length > 0 ? (
            <TreeTable
              ref={dt}
              sortMode="multiple"
              value={nodes}
              filters={filters}
              // header={header}
              rows={5}
              id="table"
              selectionMode="single"
              selectionKeys={selectedProduct}
              onSelectionChange={(e) => getSubDocType(e.value)}
              onExpand={onNodeExpand}
              // onToggle={e => setParentId2(e.value)}
              className="mt-4"
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column expander={true}></Column>
              {column.map((e: any, i: any) => {
                if (e.visible) {
                  if (e.type === "Radio") {
                    return (
                      <Column
                        header={e.header}
                        body={(data2) => (
                          <>
                            <RadioButton
                              inputId={data2}
                              name={data2.id}
                              value={selectedCategory}
                              onChange={(e) => setSelectedCategory(data2)}
                              checked={selectedCategory === data2}
                            />
                          </>
                        )}
                      />
                    );
                  }
                  if (e.type === "CheckBox") {
                    return (
                      <Column
                        key={i}
                        header={e.header}
                        body={(data) => (
                          <Checkbox
                            key={Math.random()}
                            name={data.id}
                            value={e.field}
                            onChange={(x) => {
                              onSelectCheckBox(x, e.field, data);
                            }}
                            checked={defaultChecked(e.field, data)}
                          />

                          // <input
                          //   key={Math.random()}
                          //   type="checkbox"
                          //   onChange={ele => {
                          //     data.data.checkBoxSelected = ele.target.checked;
                          //   }}
                          //   defaultChecked={data.data.checkBoxSelected}
                          //   style={{ width: '15px', height: '15px' }}
                          // />
                        )}
                      ></Column>
                    );
                  }
                  if (e.type === "Action") {
                    return (
                      <Column
                        header={e.header}
                        body={(data2) => (
                          <>
                            <SplitButton
                              icon="fa-solid fa-bars"
                              className="tableActionMenu"
                              model={itemsAction}
                              onFocus={() =>
                                getActionBtn(data2.data.id, data2.data)
                              }
                            />
                          </>
                        )}
                      />
                    );
                    //  <Column header="Field Name" body={rowData => <span>Hello</span>} />;
                  }
                  if (e.type === "Button") {
                    return (
                      <Column
                        header={e.header}
                        body={(data2) => (
                          <>
                            {buttonAction.map((button) => (
                              <>
                                {button.visible == true && (
                                  <Button
                                    tooltip={button.label}
                                    tooltipOptions={{ position: "top" }}
                                    className={button.className + " gridIcon"}
                                    onClick={() =>
                                      button["id"] == "Delete"
                                        ? deleteConfirmOnAction(
                                            data2.id,
                                            button["askReason"]
                                          )
                                        : eval(
                                            prop[buttonAction[0].command](
                                              data2.id,
                                              gridId,
                                              true,
                                              editObject
                                            )
                                          )
                                    }
                                  >
                                    <i className={button.icon}></i>
                                  </Button>
                                )}
                              </>
                            ))}
                          </>
                        )}
                      />
                    );
                  }
                  if (e.editable == true) {
                    return (
                      <Column
                        key={i}
                        field={e.field}
                        header={e.header}
                        editor={typeEditor}
                        expander={e.expander}
                        sortable
                      />
                    );
                  } else {
                    return (
                      <Column
                        key={i}
                        field={e.field}
                        header={e.header}
                        expander={e.expander}
                        sortable
                      />
                    );
                  }
                  // return <Column key={i} field={e.field} header={e.header} editor={typeEditor} expander={e.expander} sortable />;
                } else return null;
              })}
              {/* {prop.flag && (
                <Column
                  style={{ minWidth: '11%' }}
                  header="Action"
                  body={data1 => (
                    <div>
                      {prop.actionFlag.edit && (
                        <>
                          <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <FontAwesomeIcon icon="list" />{' '}
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <a className="dropdown-item" style={{ color: 'darkblue' }} onClick={() => edit(data1.key)}>
                                <FontAwesomeIcon style={{ color: 'darkblue' }} icon={faPenToSquare} /> Edit
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" style={{ color: 'darkblue' }} onClick={() => editSub(data1.key)}>
                                <FontAwesomeIcon style={{ color: 'orangered' }} icon={faFileWord} /> Add Sub Documents
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" style={{ color: 'darkblue' }} onClick={() => confirm2(data1.key)}>
                                <FontAwesomeIcon style={{ color: 'indianred' }} icon={faTrashCan} /> Obsolete
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" style={{ color: 'darkblue' }} onClick={() => edit(data1.id)}>
                                <FontAwesomeIcon style={{ color: 'indianred' }} icon="eye" /> Preview
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" onClick={() => edit(data1.id)}>
                                <FontAwesomeIcon icon={faCloudUpload} /> Release
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" style={{ color: 'darkblue' }} onClick={() => revice(data1.key)}>
                                <FontAwesomeIcon style={{ color: 'indianred' }} icon="refresh" /> Revice
                              </a>
                            </li>

                            <li>
                              <a className="dropdown-item" style={{ color: 'darkblue' }} onClick={() => edit(data1.id)}>
                                <FontAwesomeIcon style={{ color: 'green' }} icon={faDownload} /> Download
                              </a>
                            </li>
                          </ul>
                        </>
                      )}
                    </div>
                  )}
                />
              )}

              {!prop.flag && (
                <Column
                  style={{ minWidth: '11%' }}
                  header="Action"
                  body={data1 => (
                    <div>
                      {prop.actionFlag.edit && (
                        <>
                          <div>
                            {!data1.isLastNode && (
                              <Button
                                onClick={() => getParentId(data1.data.id, data1.data.level)}
                                type="button"
                                icon="pi pi-plus"
                                severity="success"
                                rounded
                              ></Button>
                            )}
                            <Button
                              onClick={() => toggleEdit(data1.data.id, data1.data.level)}
                              style={{ marginLeft: '0.5rem' }}
                              type="button"
                              icon="pi pi-pencil"
                              rounded
                            ></Button>
                            <Button
                              style={{ marginLeft: '0.5rem' }}
                              onClick={() => confirm2(data1.data.id)}
                              type="button"
                              icon="pi pi-trash"
                              severity="danger"
                              rounded
                            ></Button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                />
              )} */}
            </TreeTable>
          ) : (
            <div className="alert alert-warning">
              <Translate contentKey="home.notFound">No records found</Translate>
            </div>
          )}
          {reasonFlag && (
            <AskReason
              data={reasonIdDelete}
              action="delete"
              visible={reasonFlag}
              saveWithReason={accept}
              onClose={handleCloseForReason}
            />
          )}
        </>

        {/* </InfiniteScroll> */}

        {prop.flag && (
          <div className="p-dialog-footer">
            <Button
              color="primary"
              id="save-entity"
              className="btnStyle"
              onClick={save}
              data-cy="entityCreateSaveButton"
            >
              <FontAwesomeIcon icon="save" />
              Save
              {/* <Translate contentKey="entity.action.save">Save</Translate> */}
            </Button>
          </div>
        )}
      </div>
      {/* <Toast ref={toast} />
     <ConfirmDialog /> */}
    </div>
  );
};

export default Treetable;
