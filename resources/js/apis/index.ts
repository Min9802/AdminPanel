import Axios from "axios";
import { API_SERVER } from "@/configs/constant";
import reduxStore from "@/store/reducers/redux";
import { RootState } from "@/store/reducers/rootReducer";
reduxStore.subscribe(listener);

const select = (state: RootState) => {
    const access_token = state.admin.access_token;
    return access_token;
};
const selectLange = (state: RootState) => {
    const language = state.app.language;
    return language;
};
function listener() {
    let access_token = select(reduxStore.getState());
    let language = selectLange(reduxStore.getState());
    if (access_token) {
        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${access_token.access_token}`;
        axios.defaults.headers.common["Language"] = language;
    } else {
        axios.defaults.headers.common["Language"] = language;
    }
}

const axios = Axios.create({
    baseURL: `${API_SERVER}`,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-TOKEN": document.head
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content"),
    },
});

axios.interceptors.request.use(
    (config) => {
        return Promise.resolve(config);
    },
    (error) => Promise.reject(error)
);
axios.interceptors.response.use(
    (response) => Promise.resolve(response),
    (error) => {
        return Promise.reject(error);
    }
);

export default axios;
