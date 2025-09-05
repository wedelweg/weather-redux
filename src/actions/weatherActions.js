import {
    SET_CITY, CLEAR_SUGGESTIONS, CLEAR_ERROR,
    FETCH_WEATHER_START, FETCH_WEATHER_SUCCESS, FETCH_WEATHER_FAILURE,
    SET_FORECAST, SET_SUGGESTIONS,
} from "./types";
import {
    getWeatherByCity, getWeatherByCoords, getForecast, getSuggestions,
} from "../services/openWeather";

export const setCity = (city) => ({ type: SET_CITY, payload: city });
export const clearSuggestions = () => ({ type: CLEAR_SUGGESTIONS });
export const clearError = () => ({ type: CLEAR_ERROR });

const fetchWeatherStart = () => ({ type: FETCH_WEATHER_START });
const fetchWeatherSuccess = (weather) => ({ type: FETCH_WEATHER_SUCCESS, payload: weather });
const fetchWeatherFailure = (error) => ({ type: FETCH_WEATHER_FAILURE, payload: error });
const setForecastAction = (forecast) => ({ type: SET_FORECAST, payload: forecast });
const setSuggestionsAction = (list) => ({ type: SET_SUGGESTIONS, payload: list });

const suggestCache = new Map();
const SUGGEST_TTL = 120000;

export const fetchSuggestionsThunk = (q) => async (dispatch) => {
    const key = q.trim().toLowerCase();
    if (!key) return dispatch(setSuggestionsAction([]));

    const cached = suggestCache.get(key);
    const now = Date.now();
    if (cached && now - cached.ts < SUGGEST_TTL) {
        return dispatch(setSuggestionsAction(cached.data));
    }

    const data = await getSuggestions(q);
    suggestCache.set(key, { ts: now, data });
    dispatch(setSuggestionsAction(data));
};

export const fetchForecastThunk = ({ lat, lon }) => async (dispatch) => {
    try {
        const fc = await getForecast({ lat, lon });
        dispatch(setForecastAction(fc));
    } catch (e) {
        dispatch(fetchWeatherFailure(e.message || "Forecast error"));
    }
};

export const fetchWeatherByCityThunk = (q) => async (dispatch) => {
    try {
        dispatch(fetchWeatherStart());
        const weather = await getWeatherByCity(q);
        dispatch(fetchWeatherSuccess(weather));
        const { lat, lon } = weather.coord || {};
        if (lat != null && lon != null) {
            dispatch(fetchForecastThunk({ lat, lon }));
        }
    } catch (e) {
        dispatch(fetchWeatherFailure(e.message || "Weather request error"));
    }
};

export const fetchWeatherByCoordsThunk = ({ lat, lon }) => async (dispatch) => {
    try {
        dispatch(fetchWeatherStart());
        const weather = await getWeatherByCoords({ lat, lon });
        dispatch(fetchWeatherSuccess(weather));
        dispatch(fetchForecastThunk({ lat, lon }));
    } catch (e) {
        dispatch(fetchWeatherFailure(e.message || "Weather request error"));
    }
};
