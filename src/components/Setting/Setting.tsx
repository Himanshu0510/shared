import React, { Component } from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";

import axios from "axios";

interface ModalInputProps {
  show?: boolean;
  onSetting?: any;
  columns: any;
  filter: boolean;
  gridId?: string;
  gridData: any;
  onClose?: any;
}
class Setting extends Component<ModalInputProps> {
  tableColumns: any;
  state = {
    visible: this.props.show,
    columns: this.props.columns,
    filter: this.props.filter,
    gridData: this.props.gridData,
    prop: this.props,
    language: sessionStorage.getItem("Language"),
  };
  constructor(props: any) {
    super(props);
    if (this.state.gridData.length === 0) {
      this.tableColumns = this.state.columns;
    } else {
      this.tableColumns = this.state.gridData;
      console.log("Grid Api response");
    }
  }
  async getcolumns() {
    console.log(this.state);
    let data: any = [];
    const entity = {
      gridId: this.state.prop.gridId,
      gridSettingDetailText: JSON.stringify(this.props.columns),
      menuItemId: sessionStorage.getItem("menuItemId"),
      userMasterId: 1,
      hierarchyLevelId: 352,
      languageId: 1,
    };

    data = await axios.put("api/grid-user-settings/saveUpdateData", entity);
    const dataJson = JSON.parse(data.data.gridSettingDetailText);
    console.log("colom", dataJson);

    if (dataJson.length == 0) {
      this.tableColumns = this.state.columns;
    } else {
      this.tableColumns = dataJson;
    }
  }

  componentDidMount() {
    // this.getcolumns();
  }
  toggle = (e: any) => {
    e.preventDefault();
    this.setState({ visible: !this.state.visible });
  };

  checkboxChange = (event: any, index: any) => {
    const data: any = this.tableColumns;
    data[index].visible = event.checked;
    this.setState({ columns: data });
  };

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
      visible: this.state.columns.map((e: any) => (e.visible = true)),
      columns: this.props.columns,
      // columns: this.state.columns.map(e => [{ field: e.field, header: e.header, visible: true }]),
    });
    this.resetFromServer();
  }
  async resetFromServer() {
    let id;
    if (this.state.language === "en") id = 1;
    else if (this.state.language === "hi") id = 2;
    else id = 3;
    const reset = await axios.delete(
      `/api/grid-user-settings/deleteByUserIdAndHierarchyIdAndGridIdAndMenuItemId?userMasterId=${1}&languageId=${id}&gridId=${
        this.state.prop.gridId
      }`
    );
    console.log(reset);
  }
  footerContent = () => {
    return (
      <div>
        <Button
          label="Apply"
          icon="pi pi-check"
          onClick={() => this.handleChange()}
          autoFocus
        />
        <Button label="Reset" onClick={() => this.resetSettings()} />
        <Button
          label="Cancel"
          icon="pi pi-times"
          onClick={() => {
            this.handleCancel();
          }}
          className="p-button-text"
        />
      </div>
    );
  };

  async getTabelHeaderData() {
    let data1: any = [];
    let id;
    if (this.state.language === "en") id = 1;
    else if (this.state.language === "hi") id = 2;
    else id = 3;
    const entity = {
      gridId: String(this.props.gridId),
      gridSettingDetailText: JSON.stringify(this.state.columns),
      menuItemId: sessionStorage.getItem("menuItemId"),
      userMasterId: 1,
      hierarchyLevelId: 1,
      languageId: id,
    };

    data1 = await axios.put("api/grid-user-settings/saveUpdateData", entity, {
      headers: { menuItemId: this.props.gridId ? this.props.gridId : 1 },
    });
    const dataJson = JSON.parse(data1.data.gridSettingDetailText);
    console.log(dataJson);
  }
  render() {
    const cellEditor = (options: any) => {
      return textEditor(options);
    };
    const textEditor = (options: any) => {
      return (
        <InputText
          type="text"
          value={options.value}
          onChange={(e: any) => options.editorCallback(e.target.value)}
        />
      );
    };
    const onCellEditComplete = (e: any) => {
      const { rowData, newValue, field, originalEvent: event } = e;

      switch (field) {
        case "quantity":
        default:
          if (newValue.trim().length > 0) rowData[field] = newValue;
          else event.preventDefault();
          break;
      }
    };
    const rowReorder = (e: any) => {
      // this.tableColumns = null;
      // this.tableColumns = e.value;
      if (this.state.gridData.length === 0) {
        this.setState({ columns: e.value });
        this.tableColumns = this.state.columns;
      } else {
        this.setState({ gridData: e.value });
        this.tableColumns = this.state.gridData;
      }
      console.log(e.value);
    };
    return (
      <Dialog
        header="Settings"
        //footer={this.footerContent}
        visible={this.state.visible}
        style={{ width: "80vw" }}
        onHide={() => {
          this.handleCancel();
        }}
        draggable={false}
        resizable={false}
        maximizable
      >
        <div>
          <div className="modal-content">
            <h4>
              Filter:{" "}
              <Checkbox
                onChange={() => this.setState({ filter: !this.state.filter })}
                checked={this.state.filter}
              ></Checkbox>
            </h4>
            <DataTable
              value={this.tableColumns}
              reorderableRows
              onRowReorder={(e: any) => rowReorder(e)}
              responsiveLayout="scroll"
              rows={this.tableColumns.length}
            >
              {/* <Column header="ID" body={props => <div>{props.rowIndex}</div>}></Column> */}
              <Column rowReorder style={{ width: "3rem" }} />
              <Column
                field="header"
                header="Columns"
                editor={(options: any) => cellEditor(options)}
                onCellEditComplete={onCellEditComplete}
              />
              <Column
                field="width"
                header="Width"
                editor={(options: any) => cellEditor(options)}
                onCellEditComplete={onCellEditComplete}
              />
              <Column
                header="Display"
                body={(data: any, props: any) => (
                  <div>
                    <Checkbox
                      onChange={(event: any) =>
                        this.checkboxChange(event, props.rowIndex)
                      }
                      checked={data.visible}
                      disabled={
                        data.field === "documentTypeName" ? true : false
                      }
                    ></Checkbox>
                  </div>
                )}
              ></Column>
              {/* {dynamicColumns} */}
            </DataTable>
          </div>
          <div className="p-dialog-footer">
            <Button
              className="btnStyle btn btn-success"
              onClick={() => this.handleChange()}
              autoFocus
            >
              Save
            </Button>
            <Button
              className="btnStyle btn btn-info"
              onClick={() => this.resetSettings()}
            >
              Reset
            </Button>

            <Button
              className="btnStyle btn btn-danger"
              onClick={() => this.handleCancel()}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
}
export default Setting;
