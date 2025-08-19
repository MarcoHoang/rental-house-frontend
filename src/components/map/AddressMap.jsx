import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '../common/Toast';
import { geocodeAddress } from '../../api/houseApi';

const AddressMap = ({ 
  address, 
  latitude, 
  longitude, 
  onLocationSelect,
  height = '300px', 
  width = '100%',
  className = '',
  showSearch = true
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const { showError, showSuccess } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchAddress, setSearchAddress] = useState(address || '');

  // Load Leaflet CSS
  useEffect(() => {
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
  }, []);

  // Load Leaflet JS
  useEffect(() => {
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
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

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
      geocodeAddress(address)
        .then(response => {
          if (response.data && response.data.isValid) {
            mapLat = response.data.latitude;
            mapLng = response.data.longitude;
            initializeMap(L, mapLat, mapLng);
            if (onLocationSelect) {
              onLocationSelect({
                latitude: mapLat,
                longitude: mapLng,
                address: response.data.formattedAddress || address
              });
            }
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
      const map = L.map(mapRef.current).setView([lat, lng], 15);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add marker
      const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
      markerRef.current = marker;

      // Add popup with address
      if (address) {
        marker.bindPopup(address).openPopup();
      }

      // Handle marker drag
      marker.on('dragend', function(event) {
        const marker = event.target;
        const position = marker.getLatLng();
        
        if (onLocationSelect) {
          onLocationSelect({
            latitude: position.lat,
            longitude: position.lng,
            address: address || 'Vị trí đã chọn'
          });
        }
      });

      // Handle map click
      map.on('click', function(event) {
        const lat = event.latlng.lat;
        const lng = event.latlng.lng;
        
        // Move marker to clicked position
        marker.setLatLng([lat, lng]);
        
        if (onLocationSelect) {
          onLocationSelect({
            latitude: lat,
            longitude: lng,
            address: address || 'Vị trí đã chọn'
          });
        }
      });

      mapInstanceRef.current = map;
    }
  }, [mapLoaded, latitude, longitude, address, onLocationSelect]);

  // Handle search
  const handleSearch = async () => {
    if (!searchAddress.trim()) {
      showError('Lỗi', 'Vui lòng nhập địa chỉ');
      return;
    }

    setIsLoading(true);
    try {
      const response = await geocodeAddress(searchAddress);
      if (response.data && response.data.isValid) {
        const { latitude: lat, longitude: lng } = response.data;
        
        if (mapInstanceRef.current && markerRef.current) {
          const newLatLng = [lat, lng];
          markerRef.current.setLatLng(newLatLng);
          mapInstanceRef.current.setView(newLatLng, 15);
          
          // Update popup
          markerRef.current.bindPopup(response.data.formattedAddress || searchAddress).openPopup();
          
          if (onLocationSelect) {
            onLocationSelect({
              latitude: lat,
              longitude: lng,
              address: response.data.formattedAddress || searchAddress
            });
          }
          
          showSuccess('Thành công', 'Đã tìm thấy vị trí');
        }
      } else {
        showError('Lỗi', 'Không tìm thấy địa chỉ này');
      }
    } catch (error) {
      showError('Lỗi', 'Không thể tìm kiếm địa chỉ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`address-map-container ${className}`} style={{ width, height }}>
      {showSearch && (
        <div className="map-search-container mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Nhập địa chỉ để tìm kiếm..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Đang tìm...' : 'Tìm kiếm'}
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            💡 Bạn có thể kéo marker hoặc click vào bản đồ để chọn vị trí chính xác
          </p>
        </div>
      )}
      
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-gray-600">Đang tải bản đồ...</div>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="w-full h-full border border-gray-300 rounded-lg"
        style={{ minHeight: height }}
      />
    </div>
  );
};

export default AddressMap;
