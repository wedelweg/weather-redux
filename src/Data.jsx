import React, { useRef } from "react";
import ForecastHours from "./components/ForecastHours.jsx";
import ForecastWeek from "./components/ForecastWeek.jsx";
import AnimatedWeatherIcon from "./components/AnimatedWeatherIcon.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
    setCity,
    clearSuggestions,
    fetchSuggestionsThunk,
    fetchWeatherByCityThunk,
    fetchWeatherByCoordsThunk,
} from "./actions/weatherActions";

// Small helpers for units/formatting.
const hPaToMm = (hpa) => Math.round(hpa * 0.75006);
const mToKm = (m) => (m / 1000).toFixed(0);
const localDate = (unix, tz = 0) => new Date(unix * 1000 + tz * 1000);

export default function Data() {
    const dispatch = useDispatch();
    const { city, suggestions, weather, forecast, error, status } = useSelector(
        (s) => s.weather
    );

    const typingTimer = useRef(null);

    const onChange = (e) => {
        const val = e.target.value;
        dispatch(setCity(val));
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(
            () => dispatch(fetchSuggestionsThunk(val)),
            250
        );
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) dispatch(fetchWeatherByCityThunk(city.trim()));
    };

    const selectSuggestion = (sug) => {
        dispatch(setCity(sug.display));
        dispatch(clearSuggestions());
        dispatch(fetchWeatherByCoordsThunk({ lat: sug.lat, lon: sug.lon }));
    };

    const tz = forecast?.city?.timezone ?? 0;

    const sunrise =
        weather &&
        localDate(weather.sys.sunrise, weather.timezone).toLocaleTimeString(
            "en-GB",
            { hour: "2-digit", minute: "2-digit" }
        );
    const sunset =
        weather &&
        localDate(weather.sys.sunset, weather.timezone).toLocaleTimeString(
            "en-GB",
            { hour: "2-digit", minute: "2-digit" }
        );

    return (
        <>
            <form className="searchRow" onSubmit={onSubmit}>
                <div className="searchBox">
                    <input
                        type="text"
                        placeholder="Enter city..."
                        value={city}
                        onChange={onChange}
                        aria-label="City"
                    />
                    {suggestions.length > 0 && (
                        <ul className="citySuggest">
                            {suggestions.map((s, i) => (
                                <li
                                    key={`${s.display}-${i}`}
                                    className="citySuggest__item"
                                    onClick={() => selectSuggestion(s)}
                                >
                                    {s.display}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button type="submit">
                    {status === "loading" ? "Loading..." : "Show"}
                </button>
            </form>

            {error && <div className="error">{error}</div>}

            {weather && (
                <div className="currentPanel">
                    <div className="cp-left">
                        <AnimatedWeatherIcon
                            code={weather.weather?.[0]?.icon}
                            main={weather.weather?.[0]?.main}
                            size={128}
                            className="cp-icon"
                        />
                    </div>

                    <div className="cp-center">
                        <h2 className="cp-city">
                            {weather.name}, {weather.sys?.country}
                        </h2>
                        <div className="cp-temp">{Math.round(weather.main.temp)}°C</div>
                        <div className="cp-desc">{weather.weather?.[0]?.description}</div>
                        <div className="cp-updated">
                            Updated:{" "}
                            {new Date().toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </div>
                    </div>

                    <div className="cp-right">
                        <div className="cp-grid">
                            <div className="cp-item">
                                <span className="cp-label">Feels like</span>
                                <span className="cp-val">
                  {Math.round(weather.main.feels_like)}°C
                </span>
                            </div>
                            <div className="cp-item">
                                <span className="cp-label">Humidity</span>
                                <span className="cp-val">{weather.main.humidity}%</span>
                            </div>
                            <div className="cp-item">
                                <span className="cp-label">Pressure</span>
                                <span className="cp-val">{hPaToMm(weather.main.pressure)} mm</span>
                            </div>
                            <div className="cp-item">
                                <span className="cp-label">Wind</span>
                                <span className="cp-val">
                  {weather.wind?.speed?.toFixed(1)} m/s
                </span>
                            </div>
                            <div className="cp-item">
                                <span className="cp-label">Cloudiness</span>
                                <span className="cp-val">{weather.clouds?.all ?? 0}%</span>
                            </div>
                            <div className="cp-item">
                                <span className="cp-label">Visibility</span>
                                <span className="cp-val">{mToKm(weather.visibility ?? 0)} km</span>
                            </div>
                            <div className="cp-item">
                                <span className="cp-label">Sunrise</span>
                                <span className="cp-val">{sunrise}</span>
                            </div>
                            <div className="cp-item">
                                <span className="cp-label">Sunset</span>
                                <span className="cp-val">{sunset}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {forecast && (
                <>
                    <ForecastHours list={forecast.list} timezone={tz} />
                    <ForecastWeek list={forecast.list} timezone={tz} />
                </>
            )}
        </>
    );
}
