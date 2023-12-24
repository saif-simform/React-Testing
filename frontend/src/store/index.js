import { legacy_createStore as createStore, applyMiddleware, compose } from "redux";
import createDebounce from "redux-debounced";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import API from '../../src/services/interceptor';

const middlewares = [thunk, createDebounce()];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  {},
  composeEnhancers(applyMiddleware(...middlewares))
);
API.setupInterceptors(store);
export { store };