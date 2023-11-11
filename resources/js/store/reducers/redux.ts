import { configureStore } from "@reduxjs/toolkit";

import { useDispatch } from "react-redux";
import { createStateSyncMiddleware } from "redux-state-sync";

import rootReducer from "./rootReducer";
import ActionTypes from "../actions/actionTypes";
import { persistStore } from "redux-persist";
// import { logger } from "redux-logger";
// const env = import.meta.env;
// const isDevelopment = env.VITE_APP_ENV == "local" ? true : false;

const config: any = {
    whitelist: [ActionTypes.APP_START_UP_COMPLETE, ActionTypes.CHANGE_LANGUAGE],
    channel: "local-channel",
    broadcastChannelOption: { type: "localstorage" },
};
const middlewares = [createStateSyncMiddleware(config)];
// if (isDevelopment) middlewares.push(logger);

const store = configureStore({
    reducer: rootReducer,
    middleware: [...middlewares],
});
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
