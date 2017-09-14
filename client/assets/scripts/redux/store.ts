// This file exports redux store.

import { applyMiddleware, createStore } from "redux";

// Import additional libraries for middleware.
import { createLogger } from "redux-logger";
import promiseMiddleware from "redux-promise-middleware";

// Import root reducer.
import RootReducer from "./reducers/root-reducer"

const middleware = applyMiddleware(createLogger(), promiseMiddleware());
const Store = createStore(RootReducer, middleware);

export default Store;
