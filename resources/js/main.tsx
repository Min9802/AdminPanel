import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";

import reduxStore, { persistor } from "./store/reducers/redux.js";

import App from "./App";
import LangProvider from "./Utils/LangProvider.js";
import { GuardConfigProvider } from "react-router-guarded-routes";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    // <React.StrictMode>
    <HelmetProvider>
        <Provider store={reduxStore}>
            <LangProvider>
                <Router>
                    <GuardConfigProvider>
                        <App persistor={persistor} />
                    </GuardConfigProvider>
                </Router>
            </LangProvider>
        </Provider>
    </HelmetProvider>,
    // </React.StrictMode>,
);
