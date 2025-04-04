import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

const HeatmapLayer = ({ points }) => {
    const map = useMap();

    const heatLayer = L.heatLayer(points, {
        radius: 20,        // Size of each point
        blur: 25,          // Blur effect
        maxZoom: 17,
        gradient: {        // Color gradient
            0.4: 'blue',
            0.6: 'lime',
            0.8: 'yellow',
            1.0: 'red'
        }
    }).addTo(map);

    useEffect(() => {
        if (!points || points.length === 0) return;

        // Create heatmap layer
        const heatLayer = L.heatLayer(points, {
            radius: 15,
            blur: 20,
            maxZoom: 17,
        }).addTo(map);

        // Cleanup on unmount
        return () => {
            map.removeLayer(heatLayer);
        };
    }, [map, points]);

    return null;
};

export default HeatmapLayer;