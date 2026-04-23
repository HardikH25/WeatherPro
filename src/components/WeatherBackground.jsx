import React from 'react';
import { motion } from 'framer-motion';

function ShootingStar() {
    return (
        <motion.div className="shooting-star" initial={{ top: '-10%', left: '110%', opacity: 1 }}
            animate={{ top: '110%', left: '-10%', opacity: [1, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 10 + Math.random() * 20, ease: 'linear' }}
        />
    );
}

export function RainEffect() {
    const drops = Array.from({ length: 80 }, (_, i) => ({ id: i, d: Math.random() * 2, x: Math.random() * 100 }));
    return (
        <div className="weather-bg rain-bg">
            <motion.div className="lightning-flash" animate={{ opacity: [0, 0, 0.4, 0, 0.6, 0] }} transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 8 }} />
            {drops.map((d) => (
                <motion.div key={d.id} className="rain-drop" style={{ left: `${d.x}%` }}
                    initial={{ y: '-5vh', opacity: 0.6 }} animate={{ y: '105vh', opacity: [0.6, 0.8, 0] }}
                    transition={{ duration: 0.6 + Math.random() * 0.4, delay: d.d, repeat: Infinity, ease: 'linear' }}
                />
            ))}
            <div className="rain-overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
        </div>
    );
}

export function SunEffect() {
    const shimmers = Array.from({ length: 25 }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100 }));

    return (
        <div className="weather-bg sun-bg">
            <div className="heat-haze-layer" />
            <motion.div className="sun-rays-artistic" animate={{ rotate: 360 }} transition={{ duration: 100, repeat: Infinity, ease: 'linear' }} />
            <motion.div className="sun-glow-core" animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }} transition={{ duration: 6, repeat: Infinity }} />

            {shimmers.map(s => (
                <motion.div key={s.id} className="shimmer-particle" style={{ left: `${s.x}%`, top: `${s.y}%`, width: 2, height: 2 }}
                    animate={{ opacity: [0, 0.3, 0], y: [0, -40, 0] }} transition={{ duration: 5 + Math.random() * 5, repeat: Infinity }}
                />
            ))}
            <div className="sun-overlay" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(251,191,36,0.1), transparent 60%)' }} />
        </div>
    );
}

export function CloudEffect() {
    return (
        <div className="weather-bg" style={{ background: 'linear-gradient(160deg, #1e293b 0%, #0f172a 100%)' }}>
            {[0, 1, 2, 3].map((i) => (
                <motion.div key={i} className="cloud-puff"
                    style={{ width: 500 + i * 100, height: 180, top: `${15 + i * 20}%`, opacity: 0.04 }}
                    initial={{ x: '-130%' }} animate={{ x: '130%' }}
                    transition={{ duration: 40 + i * 15, repeat: Infinity, ease: 'linear', delay: i * -8 }}
                />
            ))}
            <div className="cloud-overlay" />
        </div>
    );
}

export function SnowEffect() {
    const flakes = Array.from({ length: 80 }, (_, i) => ({ id: i, x: Math.random() * 100, s: 2 + Math.random() * 4 }));
    return (
        <div className="weather-bg" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #020617 100%)' }}>
            {flakes.map((f) => (
                <motion.div key={f.id} className="snowflake" style={{ left: `${f.x}%`, width: f.s, height: f.s }}
                    initial={{ y: '-10vh', opacity: 0 }} animate={{ y: '110vh', opacity: [0, 1, 1, 0], x: ['0%', '3%', '-3%', '0%'] }}
                    transition={{ duration: 6 + Math.random() * 6, repeat: Infinity, ease: 'linear' }}
                />
            ))}
            <div className="snow-overlay" style={{ background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(255,255,255,0.02) 100%)' }} />
        </div>
    );
}

export function NightEffect() {
    const stars = Array.from({ length: 60 }, (_, i) => ({ id: i, t: Math.random() * 100, l: Math.random() * 100 }));
    return (
        <div className="weather-bg" style={{ background: 'linear-gradient(160deg, #020617 0%, #0f172a 100%)' }}>
            <div className="moon-crescent" />
            <ShootingStar />
            <ShootingStar />
            {stars.map(s => (
                <motion.div key={s.id} style={{ position: 'absolute', top: `${s.t}%`, left: `${s.l}%`, width: 1.5, height: 1.5, backgroundColor: 'white', borderRadius: '50%' }}
                    animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 5 }}
                />
            ))}
        </div>
    );
}

export function FogEffect() {
    return (
        <div className="weather-bg" style={{ background: 'linear-gradient(160deg, #1e293b 0%, #0f172a 100%)' }}>
            <motion.div className="fog-layer" animate={{ opacity: [0.4, 0.6, 0.4], x: ['-3%', '3%', '-3%'] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="cloud-overlay" style={{ backdropFilter: 'blur(15px)' }} />
        </div>
    );
}