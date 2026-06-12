import React, { useState } from 'react';
import './About.css';

const FEATURES = [
    {
        icon: '📅',
        title: 'Basic Search',
        desc: 'Filter crimes by date range and type across the entire city.',
        bullets: [
            'Select any date range from 2020 to present',
            'Filter by specific crime description',
            'Results pinned on an interactive Leaflet map',
        ],
    },
    {
        icon: '📍',
        title: 'Advanced Search',
        desc: 'Drop a pin or enter an address to search within a radius.',
        bullets: [
            'Geocode any LA address automatically',
            'Set a custom search radius in miles',
            'Street View imagery per location',
            'Community comment threads per pin',
        ],
    },
    {
        icon: '🔍',
        title: 'Keyword Search',
        desc: 'Full-text search across all crime descriptions.',
        bullets: [
            'Search terms like "robbery" or "vandalism"',
            'Paginated results with map visualization',
            'Frequency count per crime type',
        ],
    },
];

const STATS = [
    { value: '1M+', label: 'Crime Records' },
    { value: '2020', label: 'Data From' },
    { value: '21', label: 'LAPD Divisions' },
    { value: '3', label: 'Search Modes' },
];

const TEAM = [
    'Kush Ahir',
    'Ayush Setpal',
    'Sameeksha Rao',
    'Aarushi Sharma',
    'Aditya Joshi',
    'Prasad Adahu',
];

const GLOSSARY = [
    { field: 'DR_NO', desc: 'Official file number (year + area + sequence)' },
    { field: 'Date Rptd', desc: 'Date the report was filed' },
    { field: 'DATE OCC', desc: 'Date the crime occurred' },
    { field: 'TIME OCC', desc: 'Time of occurrence (24-hour format)' },
    { field: 'AREA NAME', desc: 'LAPD patrol division' },
    { field: 'Crm Cd Desc', desc: 'Primary crime description' },
    { field: 'Vict Age / Sex / Descent', desc: 'Victim demographics' },
    { field: 'Premis Desc', desc: 'Premise where the crime occurred' },
    { field: 'Weapon Desc', desc: 'Weapon used (if any)' },
    { field: 'Status Desc', desc: 'Current case status' },
    { field: 'LOCATION', desc: 'Street address (rounded to nearest hundred block)' },
    { field: 'LAT / LON', desc: 'Geospatial coordinates for map plotting' },
];

function AboutCrimeAtlas() {
    const [glossaryOpen, setGlossaryOpen] = useState(false);

    return (
        <div className="about-page">

            {/* ── Hero ── */}
            <section className="about-hero">
                <div className="about-hero-badge">LAPD Open Data · 2020 – Present</div>
                <h1 className="about-hero-title">Explore Crime in Los Angeles</h1>
                <p className="about-hero-sub">
                    CrimeAtlas turns the LAPD's public dataset into an interactive map platform — giving citizens,
                    researchers, and journalists the tools to understand public-safety trends across LA.
                </p>
            </section>

            {/* ── Stats ── */}
            <div className="about-stats">
                {STATS.map(s => (
                    <div className="about-stat" key={s.label}>
                        <div className="about-stat-value">{s.value}</div>
                        <div className="about-stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Features ── */}
            <section className="about-section">
                <h2 className="about-section-title">What you can do</h2>
                <div className="about-features">
                    {FEATURES.map(f => (
                        <div className="about-feature-card" key={f.title}>
                            <div className="about-feature-icon">{f.icon}</div>
                            <h3 className="about-feature-title">{f.title}</h3>
                            <p className="about-feature-desc">{f.desc}</p>
                            <ul className="about-feature-list">
                                {f.bullets.map(b => <li key={b}>{b}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Data Source ── */}
            <section className="about-section">
                <h2 className="about-section-title">About the data</h2>
                <div className="about-data-card">
                    <p>
                        The dataset is published by the <strong>Los Angeles Police Department</strong> and transcribed
                        from original crime reports. Addresses are rounded to the nearest hundred block to protect
                        victim privacy. Records missing location data are marked at (0°, 0°) and excluded from map
                        results.
                    </p>
                    <button
                        className="about-glossary-toggle"
                        onClick={() => setGlossaryOpen(o => !o)}
                    >
                        {glossaryOpen ? '▲ Hide' : '▼ Show'} field glossary
                    </button>
                    {glossaryOpen && (
                        <table className="about-glossary-table">
                            <thead>
                                <tr><th>Field</th><th>Description</th></tr>
                            </thead>
                            <tbody>
                                {GLOSSARY.map(g => (
                                    <tr key={g.field}>
                                        <td><code>{g.field}</code></td>
                                        <td>{g.desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>

            {/* ── Team ── */}
            <section className="about-section">
                <h2 className="about-section-title">Built by</h2>
                <div className="about-team">
                    {TEAM.map(name => (
                        <div className="about-team-card" key={name}>
                            <div className="about-team-avatar">
                                {name.split(' ').map(w => w[0]).join('')}
                            </div>
                            <span className="about-team-name">{name}</span>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}

export default AboutCrimeAtlas;
