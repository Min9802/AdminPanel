import { pageInfoProps } from "@/store/reducers/appReducer";
import { FileManager } from "@/views/FileManager";

import React from "react";
import { RootState } from "@/store/reducers/rootReducer";
import { ConnectedProps, connect } from "react-redux";
import * as actions from "@/store/actions";
const ProductList: React.FC<PropsFromRedux & DispatchProps> = (props) => {
    /**
     * set page info
     */
    const pageInfo: pageInfoProps = {
        title: "label.product",
        desc: "label.product",
    };
    React.useEffect(() => {
        props.setPageInfo(pageInfo);
    }, []);
    return <FileManager />;
};
const mapStateToProps = (state: RootState) => {
    return {};
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        setPageInfo: (pageInfo: any) => dispatch(actions.SetInfoPage(pageInfo)),
    };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
interface DispatchProps {
    setPageInfo: (pageInfo: any[]) => void;
}
ProductList.displayName = "ProductList";
export default connector(ProductList);
