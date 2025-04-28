import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n";
import { Provider } from "react-redux";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/theme.scss";
import QueryProvider from "./QueryProvider";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.Fragment>
    <Provider store={store}>
      <QueryProvider>
        <App />
      </QueryProvider>
    </Provider>
    <ToastContainer />
  </React.Fragment>
);
