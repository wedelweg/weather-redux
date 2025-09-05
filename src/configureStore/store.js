import {
    legacy_createStore as createStore,
    applyMiddleware,
    compose,
    combineReducers,
} from "redux";
import { thunk } from "redux-thunk";
import weatherReducer from "../reducer/weatherReducer";

const rootReducer = combineReducers({
    weather: weatherReducer,
});

const composeEnhancers =
    (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
