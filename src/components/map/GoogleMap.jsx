import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '../common/Toast';
import { geocodeAddress } from '../../api/houseApi';

const GoogleMap = ({ 
  latitude, 
  longitude, 
  address, 
  height = '400px', 
  width = '100%',
  showMarker = true,
  zoom = 15,
  className = '',
  lazyLoad = true
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const { showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazyLoad);

  // Load Leaflet CSS only when needed
  useEffect(() => {
    if (!shouldLoad) return;
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [shouldLoad]);

  // Load Leaflet JS only when needed
  useEffect(() => {
    if (!shouldLoad) return;
    
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = () => {
      setMapLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [shouldLoad]);

  // Initialize map
  useEffect(() => {
    if (!shouldLoad || !mapLoaded || !mapRef.current) return;

    const L = window.L;
    if (!L) return;

    // Destroy existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Default coordinates (Hanoi, Vietnam)
    const defaultLat = 21.0285;
    const defaultLng = 105.8542;

    let mapLat = latitude || defaultLat;
    let mapLng = longitude || defaultLng;

    // If no coordinates but have address, try to geocode
    if ((!latitude || !longitude) && address) {
      setIsLoading(true);
      handleGeocodeAddress(address)
        .then(coords => {
          if (coords) {
            mapLat = coords.lat;
            mapLng = coords.lng;
            initializeMap(L, mapLat, mapLng);
          } else {
            // Use default coordinates if geocoding fails
            initializeMap(L, defaultLat, defaultLng);
          }
        })
        .catch(() => {
          // Use default coordinates if geocoding fails
          initializeMap(L, defaultLat, defaultLng);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      initializeMap(L, mapLat, mapLng);
    }

    function initializeMap(L, lat, lng) {
      // Create map
      const map = L.map(mapRef.current).setView([lat, lng], zoom);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add marker if requested
      if (showMarker) {
        const marker = L.marker([lat, lng]).addTo(map);
        markerRef.current = marker;

        // Add popup with address
        if (address) {
          marker.bindPopup(address).openPopup();
        }
      }

      mapInstanceRef.current = map;
    }
  }, [mapLoaded, latitude, longitude, address, showMarker, zoom]);

  // Geocode address using our backend API
  const handleGeocodeAddress = async (address) => {
    try {
      const response = await geocodeAddress(address);
      if (response.data && response.data.isValid) {
        return {
          lat: response.data.latitude,
          lng: response.data.longitude
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding failed:', error);
      showError('Lỗi', 'Không thể xác định vị trí từ địa chỉ');
      return null;
    }
  };

  // Update marker position when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && latitude && longitude) {
      const newLatLng = [latitude, longitude];
      markerRef.current.setLatLng(newLatLng);
      mapInstanceRef.current.setView(newLatLng, zoom);
      
      // Update popup
      if (address) {
        markerRef.current.bindPopup(address).openPopup();
      }
    }
  }, [latitude, longitude, address, zoom]);

  // Show load button if lazy loading and map not loaded yet
  if (lazyLoad && !shouldLoad) {
    return (
      <div className={`google-map-container ${className}`} style={{ width, height }}>
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <button
            onClick={() => setShouldLoad(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            📍 Hiển thị bản đồ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`google-map-container ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-gray-600">Đang tải bản đồ...</div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: height }}
      />
    </div>
  );
};

export default GoogleMap;
