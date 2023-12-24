import auth from "./auth";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    auth: auth,
  });
  
  export default rootReducer;