import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import { Component } from "react";

class Table extends Component<{ data: any }> {
  render() {
    return (
      <>
        <h1>Names</h1>
        <DataTable value={this.props.data} tableStyle={{ minWidth: "50rem" }}>
          <Column field="name" header="Name"></Column>
        </DataTable>
      </>
    );
  }
}
export default Table;
