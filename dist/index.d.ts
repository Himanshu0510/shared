import { Component } from 'react';

interface ModalInputProps$1 {
    show: boolean;
    onSetting: any;
    columns: any;
    filter: boolean;
    gridId: string;
    gridData: any;
    onClose: any;
}
declare class Setting extends Component<ModalInputProps$1> {
    tableColumns: any;
    constructor(props: any);
    state: {
        visible: any;
        columns: any;
        filter: any;
        gridData: any;
        prop: any;
        language: string | null;
    };
    getcolumns(): Promise<void>;
    componentDidMount(): void;
    toggle: (e: any) => void;
    checkboxChange: (event: any, index: any) => void;
    handleChange(): void;
    handleCancel(): void;
    resetSettings(): void;
    resetFromServer(): Promise<void>;
    footerContent: () => any;
    getTabelHeaderData(): Promise<void>;
    render(): any;
}

declare const Translate: (prop: any) => any;

declare const Table: (prop: any) => any;

interface ModalInputProps {
    show: boolean;
    onSetting: any;
    columns: any;
}
declare class ExportSetting extends Component<ModalInputProps> {
    state: {
        visible: any;
        columns: any;
        prop: any;
    };
    constructor(props: any);
    toggle: (e: any) => void;
    checkboxChange: (event: any, index: any) => void;
    handleChange(): void;
    handleCancel(): void;
    resetSettings(): void;
    render(): any;
}

declare const AskReason: (prop: any) => any;

declare const Treetable: (prop: any) => any;

export { AskReason, ExportSetting, Setting, Table, Translate, Treetable };
