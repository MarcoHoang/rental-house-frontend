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
  const [coordinates, setCoordinates] = useState(null);

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

  // Determine initial coordinates
  useEffect(() => {
    const determineInitialCoordinates = async () => {
      // If we have valid coordinates, use them
      if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
        console.log('Using provided coordinates:', { latitude, longitude });
        setCoordinates({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
        return;
      }

      // If we have address but no coordinates, try to geocode
      if (address && (!latitude || !longitude || isNaN(latitude) || isNaN(longitude))) {
        console.log('Geocoding initial address:', address);
        setIsLoading(true);
        try {
          const coords = await handleGeocodeAddress(address);
          if (coords) {
            console.log('Initial geocoded coordinates:', coords);
            setCoordinates(coords);
            if (onLocationSelect) {
              onLocationSelect({
                latitude: coords.lat,
                longitude: coords.lng,
                address: address
              });
            }
          } else {
            console.log('Initial geocoding failed, using default coordinates');
            setCoordinates({ lat: 21.0285, lng: 105.8542 }); // Hanoi default
          }
        } catch (error) {
          console.error('Initial geocoding error:', error);
          setCoordinates({ lat: 21.0285, lng: 105.8542 }); // Hanoi default
        } finally {
          setIsLoading(false);
        }
      } else {
        // Use default coordinates
        console.log('Using default coordinates');
        setCoordinates({ lat: 21.0285, lng: 105.8542 }); // Hanoi default
      }
    };

    determineInitialCoordinates();
  }, [latitude, longitude, address, onLocationSelect]);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !coordinates) return;

    const L = window.L;
    if (!L) return;

    console.log('Initializing AddressMap with coordinates:', coordinates);

    // Destroy existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
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

    initializeMap(L, coordinates.lat, coordinates.lng);
  }, [mapLoaded, coordinates, address, onLocationSelect]);

  // Geocode address using our backend API
  const handleGeocodeAddress = async (address) => {
    try {
      console.log('Calling geocoding API for address:', address);
      const response = await geocodeAddress(address);
      console.log('Geocoding API response:', response);
      
      if (response.data && response.data.isValid) {
        return {
          lat: response.data.latitude,
          lng: response.data.longitude
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding failed:', error);
      return null;
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchAddress.trim()) {
      showError('Lỗi', 'Vui lòng nhập địa chỉ');
      return;
    }

    setIsLoading(true);
    try {
      const coords = await handleGeocodeAddress(searchAddress);
      if (coords) {
        console.log('Search geocoded coordinates:', coords);
        
        if (mapInstanceRef.current && markerRef.current) {
          const newLatLng = [coords.lat, coords.lng];
          markerRef.current.setLatLng(newLatLng);
          mapInstanceRef.current.setView(newLatLng, 15);
          
          // Update popup
          markerRef.current.bindPopup(searchAddress).openPopup();
          
          if (onLocationSelect) {
            onLocationSelect({
              latitude: coords.lat,
              longitude: coords.lng,
              address: searchAddress
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
