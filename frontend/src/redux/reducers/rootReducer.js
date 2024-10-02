import { combineReducers } from "redux";
import userReducer from "./userReducer";
import feedReducer from "./feedReducer";

const rootReducer =combineReducers ({
    userReducer,
    feedReducer
})

export default rootReducer;