import {
    SET_CITY, CLEAR_SUGGESTIONS, CLEAR_ERROR,
    FETCH_WEATHER_START, FETCH_WEATHER_SUCCESS, FETCH_WEATHER_FAILURE,
    SET_FORECAST, SET_SUGGESTIONS,
} from "../actions/types";

const initialState = {
    city: "",
    suggestions: [],
    weather: null,
    forecast: null,
    status: "idle",     // idle | loading | succeeded | failed
    error: "",
};

export default function weatherReducer(state = initialState, action) {
    switch (action.type) {
        case SET_CITY:
            return { ...state, city: action.payload };
        case CLEAR_SUGGESTIONS:
            return { ...state, suggestions: [] };
        case CLEAR_ERROR:
            return { ...state, error: "" };

        case FETCH_WEATHER_START:
            return { ...state, status: "loading", error: "" };
        case FETCH_WEATHER_SUCCESS:
            return { ...state, status: "succeeded", weather: action.payload };
        case FETCH_WEATHER_FAILURE:
            return { ...state, status: "failed", error: action.payload || "Error" };

        case SET_FORECAST:
            return { ...state, forecast: action.payload };
        case SET_SUGGESTIONS:
            return { ...state, suggestions: action.payload || [] };

        default:
            return state;
    }
}
