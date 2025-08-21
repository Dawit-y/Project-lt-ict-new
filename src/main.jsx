import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n";
import { Provider } from "react-redux";
import store from "./store";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/theme.scss";
import "react-toastify/dist/ReactToastify.css";
import QueryProvider from "./QueryProvider";
import { ToastContainer } from "react-toastify";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.Fragment>
    <DndProvider backend={HTML5Backend}>
      <Provider store={store}>
        <QueryProvider>
          <App />
        </QueryProvider>
      </Provider>
      <ToastContainer />
    </DndProvider>
  </React.Fragment>,
);
