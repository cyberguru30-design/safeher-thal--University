import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Shield,
  Phone,
  Clock,
  Compass,
  Search,
  Filter,
  CheckCircle2,
  Navigation2,
  AlertTriangle,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { SafetyResource, SafetyResourceType } from '../types';

export const SafetyMapPage: React.FC = () => {
  const { resources, currentCoords, refreshLocation, isLocating } = useSafety();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);

  const [selectedResource, setSelectedResource] = useState<SafetyResource | null>(resources[0]);
  const [selectedCategory, setSelectedCategory] = useState<SafetyResourceType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Default Center (District Bhakkar, Punjab, Pakistan coordinates)
  const defaultLat = currentCoords?.latitude || 31.6248;
  const defaultLng = currentCoords?.longitude || 71.0648;

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 14,
      zoomControl: true,
    });

    // OpenStreetMap standard tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update User Marker whenever currentCoords changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentCoords) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([currentCoords.latitude, currentCoords.longitude]);
      } else {
        userMarkerRef.current = L.circleMarker([currentCoords.latitude, currentCoords.longitude], {
          radius: 9,
          fillColor: '#7651A8',
          color: '#FFFFFF',
          weight: 3,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(map);

        userMarkerRef.current.bindPopup(
          '<div style="font-family: inherit; font-size: 12px; font-weight: bold; color: #4A245E;">📍 Your Location</div>'
        );
      }
    }
  }, [currentCoords]);

  // Update Resources markers when filter or search changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    const filtered = resources.filter((res) => {
      const matchCat = selectedCategory === 'All' || res.category === selectedCategory;
      const matchQuery =
        !searchQuery ||
        res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });

    filtered.forEach((res) => {
      const color =
        res.category === 'Police'
          ? '#4A245E'
          : res.category === 'Hospital'
          ? '#D92D45'
          : res.category === 'Transport'
          ? '#247A55'
          : '#7651A8';

      const marker = L.circleMarker([res.latitude, res.longitude], {
        radius: 8,
        fillColor: color,
        color: '#FFFFFF',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85,
      });

      marker.bindTooltip(res.name, { direction: 'top', offset: [0, -8] });
      marker.on('click', () => {
        setSelectedResource(res);
        map.setView([res.latitude, res.longitude], 15);
      });

      markersLayer.addLayer(marker);
    });
  }, [resources, selectedCategory, searchQuery]);

  const handleCenterUser = async () => {
    const coords = await refreshLocation();
    if (coords && mapInstanceRef.current) {
      mapInstanceRef.current.setView([coords.latitude, coords.longitude], 15);
    }
  };

  const categories: (SafetyResourceType | 'All')[] = ['All', 'Police', 'Hospital', 'Transport', 'HelpPoint'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5EE] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#25212B] tracking-tight">
              Safety Resource Map
            </h1>
            <span className="text-xs font-bold text-[#247A55] bg-emerald-50 px-2.5 py-0.5 rounded-lg">
              Verified Public Safe Zones
            </span>
          </div>
          <p className="text-sm text-[#77717F] mt-1">
            Locate 24/7 emergency police stations, Rescue 1122 stations, DHQ trauma hospital, and women protection centers in District Bhakkar, Punjab, Pakistan.
          </p>
        </div>

        <button
          onClick={handleCenterUser}
          disabled={isLocating}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4A245E] hover:bg-[#3D1D4E] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <Navigation2 className="w-4 h-4" />
          <span>{isLocating ? 'Locating...' : 'My Location'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 border border-[#E9E5EE] flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#4A245E] text-white'
                  : 'bg-[#FAF9FC] text-[#77717F] hover:bg-[#F1EAF8] hover:text-[#4A245E]'
              }`}
            >
              {cat === 'All' ? 'All Havens' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#77717F]" />
          <input
            type="text"
            placeholder="Search facility name or road..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8]"
          />
        </div>
      </div>

      {/* Map Viewport & Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Leaflet Map Box (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E9E5EE] overflow-hidden shadow-sm relative">
          <div ref={mapContainerRef} className="h-[480px] sm:h-[540px] w-full z-10" />

          {/* Map Legend Floating Tag */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-md border border-[#E9E5EE] text-[11px] space-y-1.5">
            <div className="font-bold text-[#25212B] uppercase tracking-wider mb-1">Map Legend</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7651A8] ring-2 ring-white" />
              <span>Your Live Location</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4A245E]" />
              <span>Police Station</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D92D45]" />
              <span>Trauma Hospital</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#247A55]" />
              <span>Safe Night Transit Hub</span>
            </div>
          </div>
        </div>

        {/* Detail Panel & Nearby List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedResource ? (
            <div className="bg-white rounded-3xl p-6 border border-[#7651A8] shadow-md space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#7651A8] bg-[#F1EAF8] px-2 py-0.5 rounded uppercase tracking-wider">
                    {selectedResource.category}
                  </span>
                  <h3 className="text-base font-extrabold text-[#25212B] mt-1.5">{selectedResource.name}</h3>
                </div>
                {selectedResource.verified && (
                  <span className="text-[#247A55]" title="Verified Facility">
                    <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                  </span>
                )}
              </div>

              <p className="text-xs text-[#77717F] leading-relaxed">{selectedResource.description}</p>

              <div className="space-y-2 py-3 border-y border-[#E9E5EE] text-xs">
                <div className="flex items-start gap-2 text-[#25212B]">
                  <MapPin className="w-4 h-4 text-[#7651A8] shrink-0 mt-0.5" />
                  <span>{selectedResource.address}</span>
                </div>
                <div className="flex items-center gap-2 text-[#25212B]">
                  <Clock className="w-4 h-4 text-[#247A55] shrink-0" />
                  <span>{selectedResource.operatingHours}</span>
                </div>
                <div className="flex items-center gap-2 text-[#25212B]">
                  <Phone className="w-4 h-4 text-[#D92D45] shrink-0" />
                  <a href={`tel:${selectedResource.phone}`} className="font-bold text-[#4A245E] hover:underline">
                    {selectedResource.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:${selectedResource.phone}`}
                  className="flex-1 py-2.5 bg-[#4A245E] hover:bg-[#3D1D4E] text-white text-xs font-bold rounded-xl text-center shadow-sm transition-colors"
                >
                  Call Facility
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedResource.latitude},${selectedResource.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2.5 bg-[#FAF9FC] hover:bg-[#F1EAF8] border border-[#E9E5EE] text-[#7651A8] text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                >
                  <span>Directions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 border border-[#E9E5EE] text-center text-xs text-[#77717F]">
              Click any pin on the map to view facility phone numbers and directions.
            </div>
          )}

          {/* Quick List of Nearby Resources */}
          <div className="bg-white rounded-3xl p-5 border border-[#E9E5EE] shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-[#25212B] uppercase tracking-wider">Nearby Safety Havens</h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {resources.map((res) => (
                <button
                  key={res.id}
                  onClick={() => {
                    setSelectedResource(res);
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.setView([res.latitude, res.longitude], 15);
                    }
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-colors ${
                    selectedResource?.id === res.id
                      ? 'bg-[#F1EAF8] border-[#7651A8]'
                      : 'bg-[#FAF9FC] border-[#E9E5EE] hover:bg-white'
                  }`}
                >
                  <p className="text-xs font-bold text-[#25212B] truncate">{res.name}</p>
                  <p className="text-[11px] text-[#77717F] flex items-center justify-between mt-0.5">
                    <span>{res.category}</span>
                    <span className="font-semibold text-[#4A245E]">~{res.distanceKm} km away</span>
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
