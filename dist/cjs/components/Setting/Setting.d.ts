import { Component } from "react";
interface ModalInputProps {
    show: boolean;
    onSetting: any;
    columns: any;
    filter: boolean;
    gridId: string;
    gridData: any;
    onClose: any;
}
declare class Setting extends Component<ModalInputProps> {
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
export default Setting;
