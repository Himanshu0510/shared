import React, { Component } from 'react';

declare class Label extends Component {
    state: {
        name: string;
    };
    render(): React.JSX.Element;
}

interface ModalInputProps {
    show?: boolean;
    onSetting?: any;
    columns: any;
    filter: boolean;
    gridId?: string;
    gridData: any;
    onClose?: any;
}
declare class Setting extends Component<ModalInputProps> {
    tableColumns: any;
    state: {
        visible: boolean | undefined;
        columns: any;
        filter: boolean;
        gridData: any;
        prop: Readonly<ModalInputProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        language: string | null;
    };
    constructor(props: any);
    getcolumns(): Promise<void>;
    componentDidMount(): void;
    toggle: (e: any) => void;
    checkboxChange: (event: any, index: any) => void;
    handleChange(): void;
    handleCancel(): void;
    resetSettings(): void;
    resetFromServer(): Promise<void>;
    footerContent: () => React.JSX.Element;
    getTabelHeaderData(): Promise<void>;
    render(): React.JSX.Element;
}

declare class Table extends Component<{
    data: any;
}> {
    render(): React.JSX.Element;
}

export { Label, Setting, Table };
