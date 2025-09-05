import React from "react";
import AnimatedWeatherIcon from "./AnimatedWeatherIcon.jsx";

const fmtHour = (dt, tz) =>
    new Date((dt + tz) * 1000).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
    });

export default function ForecastHours({ list, timezone = 0 }) {

    const items = list.slice(0, 8);
    return (
        <section className="section">
            <h3 className="section-title">Next hours</h3>
            <div className="hours no-scrollbar">
                {items.map((it, idx) => {
                    const pop = Math.round((it.pop || 0) * 100);
                    const rainMM = it.rain?.["3h"] ? `${it.rain["3h"].toFixed(1)} mm` : null;

                    return (
                        <div className="hour-card" key={idx}>
                            <div className="h-time">{fmtHour(it.dt, timezone)}</div>
                            <AnimatedWeatherIcon
                                code={it.weather[0].icon}
                                main={it.weather[0].main}
                                size={56}
                                className="h-icon"
                            />
                            <div className="h-temp">{Math.round(it.main.temp)}°C</div>
                            <div className="h-extra">
                                {pop > 0 ? `precipitation ${pop}%` : "no precipitation"}
                                {rainMM ? ` · ${rainMM}` : ""}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
