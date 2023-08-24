import React, { Component } from "react";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faRepeat } from "@fortawesome/free-solid-svg-icons";

interface ModalInputProps {
  show: boolean;
  onSetting: any;
  columns: any;
}
class ExportSetting extends Component<ModalInputProps> {
  state = {
    visible: this.props.show,
    columns: this.props.columns,
    prop: this.props,
  };
  constructor(props: any) {
    super(props);
    this.state.columns.map((e: any) => {
      e.visible = true;
    });
  }
  toggle = (e: any) => {
    e.preventDefault();
    this.setState({ visible: !this.state.visible });
  };

  checkboxChange = (event: any, index: any) => {
    const data: any = this.state.columns;
    data[index].visible = event.checked;
    this.setState({ columns: data });
  };

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
      columns: this.state.columns.map((e: any) => (e.visible = true)),
    });
  }

  render() {
    const onRowReorder = (e: any) => {
      this.setState({ columns: e.value });
    };
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
    const footerContent = (
      <div>
        <Button
          label="Export"
          icon="pi pi-check"
          onClick={() => this.handleChange()}
          autoFocus
        />
        {/* <Button label="Reset" onClick={() => this.resetSettings()} />
        <Button
          label="Cancel"
          icon="pi pi-times"
          onClick={() => {
            this.handleCancel();
          }}
          className="p-button-text"
        /> */}
      </div>
    );

    return (
      <Dialog
        header="Exports"
        footer={footerContent}
        maximizable
        visible={this.state.visible}
        style={{ width: "50vw" }}
        onHide={() => {
          this.handleCancel();
        }}
      >
        <div className="modal-content">
          <DataTable
            // reorderableRows
            dataKey="id"
            value={this.state.columns}
            // onRowReorder={onRowReorder}
            responsiveLayout="scroll"
            rows={this.state.columns.length}
          >
            {/* <Column header="ID" body={props => <div>{props.rowIndex}</div>}></Column> */}
            <Column
              field="header"
              header="Columns"
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
            <FontAwesomeIcon icon={faCheck} /> Export
          </Button>
        </div>
        {/* <Button label="Export" icon="pi pi-check" onClick={() => this.handleChange()} autoFocus /> */}
      </Dialog>
    );
  }
}
export default ExportSetting;
