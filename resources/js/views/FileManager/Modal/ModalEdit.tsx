import React from "react";
import { useTranslation } from "react-i18next";
import * as actions from "@/store/actions";
import CodeMirror, { Extension } from "@uiw/react-codemirror";
import {
    loadLanguage,
    langs,
    LanguageName,
} from "@uiw/codemirror-extensions-langs";
import { FileProps } from "../FileManager";
import DialogModal from "@/components/Modal/DialogModal";
import { getType } from "../Utils/FileUtils";
import { download } from "../Utils/ActionUtils";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/reducers/rootReducer";
import { ScrollArea } from "@min98/ui";

interface ModalEditProps {
    open: boolean;
    onClose: () => void;
    actions?: (data: any) => void;
    disk: string;
    item: FileProps;
}

const ModalEdit: React.FC<PropsFromRedux & DispatchProps & ModalEditProps> = ({
    open,
    disk,
    item,
    onClose,
    actions,
    ...props
}) => {
    const { t } = useTranslation();
    const [language, setLanguage] = React.useState<LanguageName>("textile");
    const [data, setData] = React.useState<string>("");
    const [value, setValue] = React.useState<any>("");
    React.useEffect(() => {
        if (item) {
            const ext = getType(item.extension);
            if (ext) {
                const lang = Object.keys(langs).find(
                    (lang) => ext.includes(lang) ?? lang.includes(ext),
                );
                if (lang) {
                    setLanguage(lang as LanguageName);
                } else {
                    setLanguage("textile");
                }
            }
            getContent();
        }
    }, [open]);
    /**
     * get content file
     */
    const getContent = async () => {
        const response = await download(disk, item);
        if (response) {
            if (response.data.extension === "json") {
                setData(JSON.stringify(response.data, null, 4));
            } else {
                const text = new TextDecoder().decode(response.data);
                setData(text);
            }
        }
    };
    /**
     * onchange
     */
    const onChange = React.useCallback((val: any) => {
        setValue(val);
    }, []);
    /**
     * on submit
     */
    const onSubmit = async () => {
        actions?.(value);
    };
    return (
        <DialogModal
            size="4xl"
            open={open}
            cancel={onClose}
            title={t("label.edit")}
            action={onSubmit}
        >
            <ScrollArea>
                <CodeMirror
                    className="max-h-150"
                    value={data}
                    height="auto"
                    theme={props.theme}
                    extensions={[loadLanguage(language) as Extension]}
                    onChange={onChange}
                />
            </ScrollArea>
        </DialogModal>
    );
};
const mapStateToProps = (state: RootState) => {
    return {
        theme: state.app.theme,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setPageInfo: (pageInfo: any) => dispatch(actions.SetInfoPage(pageInfo)),
    };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

// Define the additional props from mapDispatchToProps
interface DispatchProps {
    setPageInfo: (pageInfo: any[]) => void;
}

export default connector(ModalEdit);
