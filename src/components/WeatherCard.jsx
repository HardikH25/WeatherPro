import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Wind,
    Droplets,
    Eye,
    Gauge,
    CloudLightning,
    CloudDrizzle,
    CloudRain,
    Snowflake,
    CloudFog,
    Cloud,
    Sun,
    Sunrise,
    Sunset,
    Activity
} from 'lucide-react';

function formatTime(timeStr) {
    if (!timeStr) return '';
    const [hh, mm] = timeStr.split(' ')[1].split(':');
    const h = parseInt(hh, 10);
    // const suffix = h >= 12 ? 'PM' : 'AM';
    // const h12 = h % 12 || 12;
    return `${h}:${mm}`;
}

function formatLocalTime(localtimeStr) {
    if (!localtimeStr) return '';
    const timePart = localtimeStr.split(' ')[1];
    return formatTime('_ ' + timePart);
}

function formatDay(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function getWeatherIcon(text, size, isDay) {
    const m = text?.toLowerCase() ?? '';
    const props = { size, strokeWidth: 1.5 };
    if (m.includes('thunder')) {
        return <CloudLightning {...props} color="#fde047" />;
    }
    if (m.includes('drizzle')) {
        return <CloudDrizzle   {...props} color="#93c5fd" />;
    }
    if (m.includes('rain')) {
        return <CloudRain {...props} color="#60a5fa" />;
    }
    if (m.includes('snow') || m.includes('ice') || m.includes('sleet')) {
        return <Snowflake {...props} color="#bae6fd" />;
    }
    if (m.includes('fog') || m.includes('mist') || m.includes('haze')) {
        return <CloudFog {...props} color="#d1d5db" />;
    }
    if (m.includes('cloud') || m.includes('overcast')) {
        return <Cloud {...props} color="#9ca3af" />;
    }
    if (!isDay && m.includes('clear')) {
        return <Sunset {...props} color="#a78bfa" />;
    }
    return <Sun {...props} color="#fbbf24" />;
}

function getAqiInfo(index) {
    const levels = [
        { label: 'Good', color: '#4ade80' },
        { label: 'Moderate', color: '#facc15' },
        { label: 'Sensitive', color: '#fb923c' },
        { label: 'Unhealthy', color: '#f87171' },
        { label: 'Very Bad', color: '#c084fc' },
        { label: 'Hazardous', color: '#f43f5e' },
    ];
    return levels[(index ?? 1) - 1] ?? levels[0];
}


function StatPill({ icon, label, value }) {
    return (
        <motion.div className="stat-pill" whileHover={{ y: -4, backgroundColor: 'rgba(255,255,255,0.06)' }}>
            <span className="stat-icon">{icon}</span>
            <div className="stat-text">
                <span className="stat-label">{label}</span>
                <span className="stat-value">{value}</span>
            </div>
        </motion.div>
    );
}

function HourlyItem({ hour, index }) {
    return (
        <motion.div className="hourly-item" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <span className="hourly-time">{formatTime(hour.time)}</span>
            <div className="hourly-icon">{getWeatherIcon(hour.condition.text, 22, hour.is_day === 1)}</div>
            <span className="hourly-temp">{Math.round(hour.temp_c)}°</span>
        </motion.div>
    );
}

function DailyItem({ day, index }) {
    return (
        <motion.div className="daily-item" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }}>
            <span className="daily-day">{index === 0 ? 'Today' : formatDay(day.date)}</span>
            <div className="daily-icon">{getWeatherIcon(day.day.condition?.text, 20)}</div>
            <span className="daily-desc">{day.day.condition?.text}</span>
            <div className="daily-temps">
                <span className="daily-max">{Math.round(day.day.maxtemp_c)}°</span>
                <span className="daily-min" style={{ opacity: 0.5 }}>{Math.round(day.day.mintemp_c)}°</span>
            </div>
        </motion.div>
    );
}

//ticking clock
function TickingClock({ initialTime }) {
    const [currentTime, setCurrentTime] = useState(() => {
        const date = new Date(initialTime.replace(/-/g, '/'));
        // Sync seconds with system clock since API only gives HH:mm
        date.setSeconds(new Date().getSeconds());
        return date;
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(prev => new Date(prev.getTime() + 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, [initialTime]);

    const h = currentTime.getHours();
    const mm = currentTime.getMinutes().toString().padStart(2, '0');
    const ss = currentTime.getSeconds().toString().padStart(2, '0');
    // const suffix = h >= 12 ? 'PM' : 'AM';
    // const h12 = h % 12 || 12;

    return (
        <div style={{ textAlign: 'right' }}>
            <p className="city-time">{h}:{mm}:{ss}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '2px', marginTop: '4px' }}>LIVE LOCAL TIME</p>
        </div>
    );
}

export default function WeatherCard({ data, onSearch }) {
    const [query, setQuery] = useState('');
    const { location, current, forecast } = data;

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) { onSearch(query.trim()); setQuery(''); }
    };

    const mainCondition = current?.condition?.text ?? 'Clear';
    const description = current?.condition?.text ?? '';
    const temp = Math.round(current?.temp_c ?? 0);
    const feelsLike = Math.round(current?.feelslike_c ?? 0);

    const todayHours = forecast.forecastday[0].hour;
    const tomorrowHours = forecast.forecastday[1]?.hour || [];
    const allAvailableHours = [...todayHours, ...tomorrowHours];
    //replace -> iphone compatability
    const cityTime = new Date(location.localtime.replace(/-/g, '/'));
    const nextHours = allAvailableHours
        .filter(h => new Date(h.time.replace(/-/g, '/')) >= cityTime)
        .slice(0, 12);

    const aqiIndex = current?.air_quality?.['us-epa-index'];
    const aqiInfo = getAqiInfo(aqiIndex);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.name}
                className="weather-card"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* search & time header */}
                <div className="card-top-row">
                    <form className="search-bar" onSubmit={handleSearch}>
                        <Search size={16} style={{ opacity: 0.4 }} />
                        <input type="text" className="search-input" placeholder="Search city..." value={query} onChange={(e) => setQuery(e.target.value)} />
                        <button type="submit" className="search-btn">GO</button>
                    </form>
                    <TickingClock initialTime={location.localtime} />
                </div>

                <div className="card-main-content">
                    {/* left display */}
                    <div className="left-panel">
                        <div className="city-info">
                            <h1 className="city-name">{location.name}</h1>
                            <p className="condition-text">{location.region || location.country} • {description}</p>
                        </div>

                        <div className="temp-hero">
                            <span className="temp-main">{temp}°</span>
                            <motion.div className="hero-icon" animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                                {getWeatherIcon(mainCondition, 120, current?.is_day === 1)}
                            </motion.div>
                        </div>
                        <p style={{ fontSize: '15px', color: 'var(--text-dim)' }}>Feels like {feelsLike}°C</p>
                    </div>

                    {/* right display*/}
                    <div className="right-panel">
                        <div className="stats-grid">
                            <StatPill icon={<Wind size={18} color="#60a5fa" />} label="Wind" value={`${Math.round(current?.wind_kph ?? 0)} km/h`} />
                            <StatPill icon={<Droplets size={18} color="#22d3ee" />} label="Humidity" value={`${current?.humidity ?? '--'}%`} />
                            <StatPill icon={<Eye size={18} color="#a855f7" />} label="Visibility" value={`${current?.vis_km ?? '--'} km`} />
                            <StatPill icon={<Gauge size={18} color="#4ade80" />} label="Pressure" value={`${current?.pressure_mb ?? '--'} hPa`} />
                            {aqiIndex && (
                                <StatPill
                                    icon={<Activity size={18} color={aqiInfo.color} />}
                                    label={`PM2.5: ${Math.round(current.air_quality?.pm2_5 ?? 0)} µg/m³`}
                                    value={`${aqiInfo.label}`}
                                />
                            )}
                        </div>

                        <div className="section-label">Next 12 Hours</div>
                        <div className="hourly-strip">
                            {nextHours.map((h, i) => <HourlyItem key={h.time} hour={h} index={i} />)}
                        </div>

                        <div className="section-label">7-Day Forecast</div>
                        <div className="daily-list">
                            {forecast.forecastday.map((d, i) => <DailyItem key={d.date} day={d} index={i} />)}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}