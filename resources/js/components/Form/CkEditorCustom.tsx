import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import EditorCustom from "@min98/ckeditor5-custom";
import { Server, UploadAdapter } from "./UploadAdapter";

interface CKEDITOR {
    handleChange?: (data: string) => void;
    config: {
        disk: string;
        path: string;
    };
}

const CkEditorCustom: React.FC<CKEDITOR> = ({
    handleChange,
    config,
    ...props
}) => {
    function UploadPlugin(editor: any) {
        editor.plugins.get("FileRepository").createUploadAdapter = (
            loader: any,
        ) => {
            const server = new Server();
            return new UploadAdapter(config, server, loader);
        };
    }

    const Configuration = {
        extraPlugins: [UploadPlugin],
    };
    return (
        <CKEditor
            config={Configuration}
            editor={EditorCustom}
            onReady={(editor: any) => {}}
            onBlur={(event: any, editor: any) => {}}
            onFocus={(event: any, editor: any) => {}}
            onChange={(event: any, editor: any) => {
                handleChange && handleChange(editor.getData());
            }}
            {...props}
        />
    );
};

CkEditorCustom.displayName = "CkEditorCustom";
export default CkEditorCustom;
