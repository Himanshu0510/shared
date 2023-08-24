import { Component } from "react";
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
export default ExportSetting;
