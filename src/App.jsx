import React from "react";
import "./App.css";
import Info from "./Info.jsx";
import Data from "./Data.jsx";
import Background from "./Background.jsx";
import { useSelector } from "react-redux";

export default function App() {
    const weather = useSelector((s) => s.weather.weather);

    return (
        <>
            <Background weather={weather} />
            <div className="wrapper">
                <div className="main">
                    <section className="info"><Info /></section>
                    <section className="form"><Data /></section>
                </div>
            </div>
        </>
    );
}
