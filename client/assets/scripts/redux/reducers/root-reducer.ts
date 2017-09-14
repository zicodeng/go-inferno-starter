// This file combines all reducers into a single root reducer
// and export it.

import { combineReducers } from "redux";

// Import reducers
import UserReducer from "./user-reducer";

const RootReducer = combineReducers({
    user: UserReducer
});

export default RootReducer;