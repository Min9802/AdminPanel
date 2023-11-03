import { combineReducers } from "@reduxjs/toolkit";
import appReducer from "./appReducer";
import adminReducer from "./adminReducer";
import userReducer from "./userReducer";
import fileManagerReducer from "./fileManagerReducer";
// ... other reducer imports
import { persistReducer } from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import storage from "redux-persist/lib/storage";

const persistCommonConfig = {
    storage: storage,
    stateReconciler: autoMergeLevel2,
};
const adminPersistConfig = {
    ...persistCommonConfig,
    key: "admin",
    whitelist: ["adminInfo", "access_token", "refresh_token"],
};
const appPersistConfig = {
    ...persistCommonConfig,
    key: "app",
    whitelist: ["loading", "language", "theme", "pageInfo", "config", "notice"],
};
const userPersistConfig = {
    ...persistCommonConfig,
    key: "user",
    whitelist: ["userInfo", "access_token", "refresh_token"],
};
const fmPersistConfig = {
    ...persistCommonConfig,
    key: "fm",
    whitelist: [
        "config",
        "mode",
        "disks",
        "directories",
        "select_disk",
        "select_dir",
        "files",
        "tree",
        "clipboard",
        "history",
        "selected",
    ],
};
const rootReducer = combineReducers({
    admin: persistReducer(adminPersistConfig, adminReducer),
    user: persistReducer(userPersistConfig, userReducer),
    app: persistReducer(appPersistConfig, appReducer),
    fm: persistReducer(fmPersistConfig, fileManagerReducer),
    // ... other reducer mappings
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
