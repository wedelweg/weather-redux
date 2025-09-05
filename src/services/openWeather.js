const API_KEY = import.meta.env.VITE_OW_KEY;

export async function getWeatherByCity(q) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&units=metric&lang=en&appid=${API_KEY}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error("City not found");
    return r.json();
}

export async function getWeatherByCoords({ lat, lon }) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${API_KEY}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error("Weather request failed");
    return r.json();
}

export async function getForecast({ lat, lon }) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${API_KEY}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error("Forecast request failed");
    return r.json();
}

export async function getSuggestions(q) {
    const key = q.trim().toLowerCase();
    if (key.length < 2) return [];
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${API_KEY}`;
    const r = await fetch(url);
    if (!r.ok) return [];
    const data = await r.json();
    return data.map((it) => ({
        display: `${it.local_names?.en || it.name}${it.state ? ", " + it.state : ""}, ${it.country}`,
        lat: it.lat,
        lon: it.lon,
    }));
}
