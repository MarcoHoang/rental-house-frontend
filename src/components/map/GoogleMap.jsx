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
  const [coordinates, setCoordinates] = useState(null);
  const [geocodingStatus, setGeocodingStatus] = useState(null); // 'success', 'fallback', 'failed'

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

  // Determine coordinates to use - chỉ chạy khi shouldLoad = true (người dùng click "Hiển thị bản đồ")
  useEffect(() => {
    if (!shouldLoad) return; // Không làm gì nếu chưa click "Hiển thị bản đồ"
    
         const determineCoordinates = async () => {
       // If we have valid coordinates, use them
       if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude) && 
           parseFloat(latitude) !== 0 && parseFloat(longitude) !== 0) {
         setCoordinates({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
         return;
       }

       // If we have address, try to geocode
       if (address) {
         setIsLoading(true);
         try {
           // Thử geocode với địa chỉ đầy đủ trước
           let coords = await handleGeocodeAddress(address);
           
           // Nếu thất bại, thử với địa chỉ đơn giản hơn
           if (!coords && address.includes(',')) {
             const parts = address.split(',');
             
             // Thử với 3 phần cuối (quận/huyện, tỉnh/thành phố)
             if (parts.length >= 3) {
               const simplifiedAddress = parts.slice(-3).join(',').trim();
               coords = await handleGeocodeAddress(simplifiedAddress);
             }
             
             // Nếu vẫn thất bại, thử với 2 phần cuối
             if (!coords && parts.length >= 2) {
               const simplifiedAddress = parts.slice(-2).join(',').trim();
               coords = await handleGeocodeAddress(simplifiedAddress);
             }
           }
           
           // Nếu vẫn thất bại, thử với tên khu vực cụ thể
           if (!coords) {
             const addressLower = address.toLowerCase();
             
             // Kiểm tra các khu vực cụ thể
             if (addressLower.includes('vinhomes ocean park')) {
               coords = await handleGeocodeAddress('Vinhomes Ocean Park, Gia Lam, Ha Noi');
             } else if (addressLower.includes('gia lâm') || addressLower.includes('gia lam')) {
               coords = await handleGeocodeAddress('Gia Lam, Ha Noi');
             } else if (addressLower.includes('cầu giấy') || addressLower.includes('cau giay')) {
               coords = await handleGeocodeAddress('Cau Giay, Ha Noi');
             } else if (addressLower.includes('hà nội') || addressLower.includes('hanoi')) {
               coords = await handleGeocodeAddress('Hanoi, Vietnam');
             } else if (addressLower.includes('hồ chí minh') || addressLower.includes('ho chi minh')) {
               coords = await handleGeocodeAddress('Ho Chi Minh City, Vietnam');
             }
           }
           
           if (coords) {
             setCoordinates(coords);
             setGeocodingStatus('success');
           } else {
             setCoordinates(null);
             setGeocodingStatus('not_found');
           }
         } catch (error) {
           setCoordinates(null);
           setGeocodingStatus('failed');
         } finally {
           setIsLoading(false);
         }
       } else {
         // No address provided
         setCoordinates(null);
         setGeocodingStatus('no_address');
       }
     };

    determineCoordinates();
  }, [shouldLoad, latitude, longitude, address]); // Thêm shouldLoad vào dependencies

     // Initialize map
   useEffect(() => {
     if (!shouldLoad || !mapLoaded || !mapRef.current || !coordinates) return;

     const L = window.L;
     if (!L) return;

     // Destroy existing map
     if (mapInstanceRef.current) {
       mapInstanceRef.current.remove();
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

     initializeMap(L, coordinates.lat, coordinates.lng);
   }, [mapLoaded, coordinates, showMarker, zoom, shouldLoad]);

     // Geocode address using our backend API (OpenStreetMap Nominatim)
   const handleGeocodeAddress = async (address) => {
     try {
       const response = await geocodeAddress(address);
       
       // Kiểm tra response structure từ backend
       if (response && response.data && response.data.data && response.data.data.valid) {
         const geocodingData = response.data.data;
         
         if (geocodingData.latitude && geocodingData.longitude) {
           const coords = {
             lat: parseFloat(geocodingData.latitude),
             lng: parseFloat(geocodingData.longitude)
           };
           return coords;
         }
       }
       
       return null;
     } catch (error) {
       showError('Lỗi', 'Không thể xác định vị trí từ địa chỉ. Vui lòng thử lại sau.');
       return null;
     }
   };

  // Update marker position when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && coordinates) {
      const newLatLng = [coordinates.lat, coordinates.lng];
      markerRef.current.setLatLng(newLatLng);
      mapInstanceRef.current.setView(newLatLng, zoom);
      
      // Update popup
      if (address) {
        markerRef.current.bindPopup(address).openPopup();
      }
    }
    
       }, [coordinates, address, zoom]);

  // Show load button if lazy loading and map not loaded yet
  if (lazyLoad && !shouldLoad) {
    return (
      <div className={`google-map-container ${className}`} style={{ width, height }}>
        <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center gap-4 p-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🗺️</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Bản đồ vị trí</h3>
            <p className="text-sm text-gray-600 mb-4">
              {address ? `Địa chỉ: ${address}` : 'Không có địa chỉ'}
            </p>
          </div>
          <button
            onClick={() => setShouldLoad(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            📍 Hiển thị bản đồ
          </button>
          <p className="text-xs text-gray-500 text-center">
            Click để xem vị trí chính xác trên bản đồ
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`google-map-container ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <div className="text-gray-600">Đang xác định vị trí...</div>
            <div className="text-sm text-gray-500 mt-1">Vui lòng chờ trong giây lát</div>
          </div>
        </div>
      )}
      
             {/* Thông báo trạng thái geocoding */}
       {geocodingStatus === 'not_found' && (
         <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-20">
           <div className="text-center p-6">
             <div className="text-6xl mb-4">🗺️</div>
             <h3 className="text-lg font-semibold text-gray-700 mb-2">Không tìm thấy trên bản đồ</h3>
             <p className="text-sm text-gray-600 mb-4">
               Địa chỉ: <strong>{address}</strong>
             </p>
             <p className="text-xs text-gray-500">
               Địa chỉ này không được tìm thấy trong hệ thống bản đồ.
             </p>
           </div>
         </div>
       )}
      
             {geocodingStatus === 'failed' && (
         <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-20">
           <div className="text-center p-6">
             <div className="text-6xl mb-4">❌</div>
             <h3 className="text-lg font-semibold text-red-600 mb-2">Lỗi xác định vị trí</h3>
             <p className="text-sm text-gray-600 mb-4">
               Địa chỉ: <strong>{address}</strong>
             </p>
             <p className="text-xs text-gray-500">
               Không thể xác định vị trí do lỗi hệ thống. Vui lòng thử lại sau.
             </p>
           </div>
         </div>
       )}
       
       {geocodingStatus === 'no_address' && (
         <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-20">
           <div className="text-center p-6">
             <div className="text-6xl mb-4">📍</div>
             <h3 className="text-lg font-semibold text-gray-700 mb-2">Không có địa chỉ</h3>
             <p className="text-sm text-gray-600">
               Chưa có thông tin địa chỉ cho nhà này.
             </p>
           </div>
         </div>
       )}
      
             {coordinates && (
         <div 
           ref={mapRef} 
           className="w-full h-full"
           style={{ minHeight: height }}
         />
       )}
    </div>
  );
};

export default GoogleMap;
