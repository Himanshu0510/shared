import React, { useState, useEffect, useRef, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { overridePaginationStateWithQueryParams } from "app/shared/util/entity-utils";
import { getSortState } from "react-jhipster";
import { ITEMS_PER_PAGE } from "app/shared/util/pagination.constants";
import { useAppDispatch } from "app/config/store";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import Setting from './setting';
import Setting from "../Setting";
import ExportSetting from "../Export-Column";
import axios from "axios";
import Translate from "../Translate";
import { InputText } from "primereact/inputtext";
import { MenuItem } from "primereact/menuitem";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import AskReason from "../Ask_Reason";
// import { setMsgLangKeyInSessionStorage } from "./validationMethod";
import _ from "lodash";

const Table = (prop: any) => {
  const dispatch = useAppDispatch();
  const menuItemId = sessionStorage.getItem("menuItemId");
  const [userId, setUserId] = useState(sessionStorage.getItem("id"));
  const dt = useRef<any>();

  const [reasonFlag, setReasonFlag] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [column, setColumn] = useState<any>();
  const [filterColumn, setFilterColumn] = useState([]);
  const [exportCol, setExportCol] = useState<any>([]);
  const [filter, setfilter] = useState(prop.toggleFilter);
  const [filters, setfilters] = useState(prop.filters);
  const [gridId, setGridId] = useState(prop.gridId);
  const [apiGridData, setApiGridData] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalExport, setModalExport] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [exportType, setExportType] = useState();
  const [selectedRecord, setSelectedRecord] = useState<any>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteHeader, setdeleteHeader] = useState(
    <Translate contentKey="documentType.deleteConfirm"></Translate>
  );
  const [deletemsg, setdeletemsg] = useState(
    <Translate contentKey="home.deleteMsg"></Translate>
  );
  const [ifShowHeader, setifShowHeader] = useState(false);
  const [ifHideHeader, setifHideHeader] = useState(true);
  const [language, setlanguage] = useState(sessionStorage.getItem("Language"));
  const [redioFilter, setRedioFilter] = useState("Active");
  const [redioFilterPublish, setRedioFilterPublish] = useState("");
  const [configurableReason, setConfigurableReason] = useState<boolean>(true);
  const [Searchplaceholder, setSearchPlaceholder] = useState("Keyword Search");
  const [configurableReasonOnCheck, setConfigurableReasonOnCheck] =
    useState<boolean>(prop.reasonAskOnCheck ? prop.reasonAskOnCheck : false);
  const [itemsAction, setitemsAction] = useState<any>([]);
  const [buttonAction, setButtonAction] = useState<any>([]);
  const [selectedItem, setSelectedItem] = useState<any>();

  const [hideActionbtn, sethideActionbtn] = useState(
    prop.hideActionbtn ? prop.hideActionbtn : false
  );
  const [rowReorder, setrowReorder] = useState(
    prop.rowReorder ? prop.rowReorder : false
  );

  const [actionId, setActionId] = useState<number>();
  const [editObject, setEditObject] = useState<any>([]);
  const getActionBtn = (id: any, object: any) => {
    setActionId(id);
    setEditObject(object);
  };
  useEffect(() => {
    const compareJsonjs = document.createElement("script");
    compareJsonjs.src =
      "https://cdn.jsdelivr.net/npm/lodash@4.17.10/lodash.min.js";
    compareJsonjs.async = true;
    document.body.appendChild(compareJsonjs);
  }, []);

  const getGridData = async () => {
    let id;
    if (language === "en") id = 1;
    else if (language === "hi") id = 2;
    else id = 3;
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
    setColumn(prop.column);
  }, [prop.column]);

  useEffect(() => {
    setActionId(actionId);
    setEditObject(editObject);
    prepareRowAction(column);
  }, [actionId, editObject]);

  useEffect(() => {
    setData(prop.data);

    // setitemsAction(prop.actionFlag);
  }, [prop.data]);

  const labelbtnFlag: any = {
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
                askReason: actinObj[j]["askReason"],
                command: () => {
                  actinObj[j]["id"] == "Delete"
                    ? deleteConfirmOnAction(
                        actionId,
                        actinObj[j]["askReason"],
                        editObject
                      )
                    : eval(
                        prop[actinObj[j].command](
                          actionId,
                          gridId,
                          actinObj[j]["askReason"],
                          editObject
                        )
                      );
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

  useEffect(() => {
    setSelectedItem(prop.sendSelectedItem ? prop.sendSelectedItem : "");
    setSelectCheckboxRc(prop.sendSelectedItem);
  }, [prop.sendSelectedItem]);

  useEffect(() => {
    getGridData();

    setRedioFilterPublish("All");
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

    setSearchPlaceholder(String(<Translate contentKey="export"></Translate>));
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
  const [deleteId, setDeleteId] = useState<any>();

  const edit = (id: any) => {
    prop.onEdit(id);
    // prop.onEdit(id);
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

  // const [actionId, setActionId] = useState(null);

  // const getActionBtn = id => {
  //   setActionId(id);
  //   prepareRowAction(prop.actionFlag, id);
  // };

  const settingChanges = (coulmnData: any, filterToggle: any) => {
    setModal(false);
    setColumn(coulmnData);
    setfilter(filterToggle);
  };
  const settingChangesExport = (coulmnData: any) => {
    setModalExport(false);
    setExportCol(coulmnData);
    const exportData = data;
    const headers: any = [];
    coulmnData.map((col: any) => {
      if (col.visible) headers.push(col.field);
    });
    const newData: any = [];
    exportData.map((element: any) => {
      const newObj: any = {};
      headers.forEach((name: any) => {
        newObj[name] = element[name];
      });
      newData.push(newObj);
      newObj;
    });
    switch (exportType) {
      case "PDF":
        exportPdf(newData, headers, coulmnData);
        break;
      case "EXCEL":
        exportExcel(newData);
        break;
      case "CSV":
        exportCSV(newData, headers);
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
  const convertToCSV = (objArray: any) => {
    const array =
      typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    let str = "";

    for (let i = 0; i < array.length; i++) {
      let line = "";
      // eslint-disable-next-line guard-for-in
      for (const index in array[i]) {
        if (line !== "") line += ",";
        line += array[i][index];
      }
      str += line + "\r\n";
    }

    return str;
  };
  const exportCSV = (newData: any, headers: any) => {
    // Convert Object to JSON
    const jsonObject = JSON.stringify(newData);

    const csv = convertToCSV(jsonObject);

    const exportedFilenmae = "report" + ".csv" || "export.csv";

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
  const exportPdf = (newData: any, headers: any, coulmnData: any) => {
    const headerss = coulmnData.map((col: any) => {
      if (col.visible) headers.push({ title: col.header, dataKey: col.field });
    });
    const unit = "pt";
    const size = "A4";
    const orientation = "portrait";
    const doc = new jsPDF(orientation, unit, size);
    const title = "Report";

    const content = {
      startY: 50,
      head: headerss,
      body: newData,
    };

    doc.text(title, 40, 40);
    autoTable(doc, content);
    doc.save("Task.pdf");
  };

  const exportExcel = (newData: any) => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(newData);
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

  const closeSettingModal = () => {
    setModal(false);
  };

  const [reasonIdDelete, setReasonIdDelete] = useState<any>();

  const deleteConfirmOnAction = async (
    id: number,
    flag: boolean,
    record: any
  ) => {
    console.log(record, "record");

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
        flag == true ? await setReasonFlag(!reasonFlag) : accept(id, record);
      },
      reject: () => reject(),
    });
  };
  const reject = () => {
    // toast.warn('You have cancel your delete request.');
  };
  const accept = (data: any, record: any) => {
    console.log(record, "record");

    prop.onDelete(data, record);
    setReasonFlag(false);
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

  const handleCloseForReason = () => {
    setReasonFlag(!reasonFlag);
    setData(prop.data);
    setSelectCheckboxRc(prop.sendSelectedItem);
  };
  const redioFilterSelection = (name: any) => {
    setRedioFilter(name);
    sessionStorage.setItem("FilterStatus", name);
    prop.onFilterChanges(name, prop.gridId);
  };
  const redioFilterPublishSelection = (name: any) => {
    setRedioFilterPublish(name);
    sessionStorage.setItem("FilterPublish", name);
    prop.onPublishFilterChanges(name, prop.gridId);
  };

  let selectedData: any = [];

  let arr: any = [];

  const setRecordForChecked = (event: any) => {
    if (event.checked) {
      arr.push(event.value);
    } else {
      let tmparr = [];
      for (let i = 0; i < arr.length; i++) {
        if (!_.isEqual(event.value, arr[i])) {
          tmparr.push(arr[i]);
        }
      }
      arr = tmparr;
    }

    setSelectedRecord(arr);
  };

  const [selectCheckboxRc, setSelectCheckboxRc] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const defaultChecked = (fieldName: any, data1: any) => {
    let flag: any;
    flag = data1[fieldName] ? typeof data1[fieldName] : undefined;
    if (flag != undefined) {
      if (flag == "boolean") {
        return data1[fieldName];
      } else if (flag == "string" || flag == "number") {
        let returnValue: boolean;
        if (flag == "number") {
          // returnValue = parseFloat(data1[fieldName]);
        }
        if (flag == "string") {
          returnValue = data1[fieldName] == "Yes" ? true : false;
        }
        return returnValue;
      }

      return data1[fieldName];
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

  const radioSelectRecord = (record: any, fieldName: any) => {
    prop.radioEvent(record, fieldName);
  };

  const filterColumnGlobal = () => {
    const globalFilterData: any = [];
    if (column) {
      column.forEach((element: any) => {
        if (element.visible) globalFilterData.push(element.field);
      });
    }
    return globalFilterData;
  };

  const onSelectCheckBox = (e: any, obj: any) => {
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
      <div className="d-flex justify-content-between align-items-center">
        {
          <div className="d-flex globlFilter">
            {filter && (
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  value={globalFilterValue}
                  onChange={(e: any) => onGlobalFilterChange(e)}
                />
              </span>
            )}
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
          {prop.statusFilter === true && (
            <span className="d-flex justify-content-center m-r-15 statusFilter">
              <span
                style={{ marginLeft: "10px" }}
                className="d-flex align-items-center"
              >
                <RadioButton
                  inputId={gridId + "gridActive"}
                  name="filter"
                  value="Active"
                  onChange={(e: any) => redioFilterSelection(e.value)}
                  checked={redioFilter === "Active"}
                />
                <label
                  htmlFor={gridId + "gridActive"}
                  style={{ marginBottom: 0 }}
                >
                  {labelbtnFlag.activeradio
                    ? labelbtnFlag.activeradio
                    : "Active"}
                </label>
              </span>
              <span
                style={{ marginLeft: "10px" }}
                className="d-flex align-items-center"
              >
                <RadioButton
                  inputId={gridId + "gridInactive"}
                  name="filter"
                  value="Inactive"
                  onChange={(e: any) => redioFilterSelection(e.value)}
                  checked={redioFilter === "Inactive"}
                />
                <label
                  htmlFor={gridId + "gridInactive"}
                  style={{ marginBottom: 0 }}
                >
                  {labelbtnFlag.inactiveradio
                    ? labelbtnFlag.inactiveradio
                    : "Inactive"}
                </label>
              </span>
              <span
                style={{ marginLeft: "10px" }}
                className="d-flex align-items-center"
              >
                <RadioButton
                  inputId={gridId + "All"}
                  name="filter"
                  value="All"
                  onChange={(e: any) => redioFilterSelection(e.value)}
                  checked={redioFilter === "All"}
                />
                <label htmlFor={gridId + "All"} style={{ marginBottom: 0 }}>
                  {labelbtnFlag.allradio ? labelbtnFlag.allradio : "All"}
                </label>
              </span>
            </span>
          )}
          <Button
            color="secondary"
            className="iconBtn"
            onClick={() => {
              setModal(!modal);
            }}
            tooltip="Setting"
            tooltipOptions={{ position: "top" }}
          >
            <FontAwesomeIcon icon="cogs" />
          </Button>
          <SplitButton
            tooltip="Export"
            tooltipOptions={{ position: "top" }}
            label={labelbtnFlag.export ? labelbtnFlag.export : "Export"}
            className="tableExportMenu"
            model={items}
          />
        </div>
      </div>

      {modal && (
        <Setting
          show={modal}
          gridId={gridId}
          gridData={apiGridData}
          filter={filter}
          columns={column}
          onClose={closeSettingModal}
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

      <div className="dataTable">
        <>
          {data && data.length > 0 ? (
            <DataTable
              ref={dt}
              sortMode="multiple"
              value={data}
              globalFilterFields={filterColumnGlobal()}
              filters={filters}
              // header={header}
              filterDisplay={filter ? "row" : "menu"}
              scrollable
              scrollHeight="400px"
              rows={5}
              id={gridId}
              selectionMode="single"
              selection={selectedItem}
              onSelectionChange={(e: any) => {
                setSelectedItem(e.value);
                prop.onSelect ? prop.onSelect(e.value) : {};
              }}
              responsiveLayout="scroll"
              onRowReorder={(e: any): void =>
                prop.onAddReorderRow(e.value, gridId)
              }
              reorderableRows
            >
              {rowReorder && <Column rowReorder style={{ minWidth: "3rem" }} />}
              {column &&
                column.map((e: any, i: any) => {
                  if (e.visible) {
                    if (e.type === "Radio") {
                      return (
                        <Column
                          header={e.header}
                          body={(data2: any) => (
                            <>
                              <RadioButton
                                inputId={data2}
                                name={data2.id}
                                value={e.field}
                                onChange={(x: any) =>
                                  radioSelectRecord(data2, e.field)
                                }
                                checked={data2[e.field] === true}
                              />
                            </>
                          )}
                        />
                      );
                    }

                    if (e.type === "CheckBox") {
                      return (
                        <Column
                          header={e.header}
                          body={(data2: any) => (
                            <>
                              <Checkbox
                                key={Math.random()}
                                name={data2.id}
                                value={e.field}
                                onChange={(e: any) => {
                                  onSelectCheckBox(e, data2);
                                }}
                                checked={defaultChecked(e.field, data2)}
                              />
                            </>
                          )}
                        />
                      );
                    }
                    if (e.type === "Action") {
                      return (
                        <Column
                          header={e.header}
                          body={(data2: any) => (
                            <>
                              <SplitButton
                                icon="fa-solid fa-bars"
                                className="tableActionMenu"
                                model={itemsAction}
                                onFocus={() => getActionBtn(data2.id, data2)}
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
                          body={(data2: any) => (
                            <>
                              {buttonAction.map((button: any) => (
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
                                              button["askReason"],
                                              data2
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
                    return (
                      <Column
                        key={i}
                        columnKey={e.field}
                        field={e.field}
                        header={e.header}
                        style={{ width: e.width }}
                        sortable
                      />
                    );
                  } else return null;
                })}
              {!hideActionbtn && <></>}
            </DataTable>
          ) : (
            <div className="alert alert-warning">
              {/* <Translate contentKey="home.notFound">No records found</Translate> */}
              No records found
            </div>
          )}
          {reasonFlag && (
            <AskReason
              data={reasonIdDelete}
              deleteObject={editObject}
              action="delete"
              visible={reasonFlag}
              saveWithReason={accept}
              onClose={handleCloseForReason}
            />
          )}
        </>
      </div>
    </div>
  );
};
export default Table;
