import * as React from "react";

import * as ReactDOM from "react-dom";
// import * as ReactRedux from "react-redux";
import * as ReactRouterDom from "react-router-dom";

import * as RadType from "rad-type";

import "./Asset";

const rootElement = document.getElementById("root");
// const store = DevevComFrontend.init();

ReactDOM.render(
  <ReactRouterDom.BrowserRouter>
    <RadType.Home />
    {/* <ReactRedux.Provider store={store}>
      <DevevComFrontend.Routes />
    </ReactRedux.Provider> */}
  </ReactRouterDom.BrowserRouter>,
  rootElement,
);
