import React, { useState } from 'react';
import GoogleMap from './GoogleMap';
import AddressMap from './AddressMap';

const MapDemo = () => {
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 21.0285,
    longitude: 105.8542,
    address: 'Hanoi, Vietnam'
  });

  const [formData, setFormData] = useState({
    address: '',
    latitude: null,
    longitude: null
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Map Components Demo</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GoogleMap Demo */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">GoogleMap Component</h2>
          <p className="text-gray-600">
            Component hiển thị bản đồ đơn giản với marker
          </p>
          
          <GoogleMap
            latitude={selectedLocation.latitude}
            longitude={selectedLocation.longitude}
            address={selectedLocation.address}
            height="300px"
            showMarker={true}
            zoom={15}
            className="border rounded-lg"
          />
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Current Location:</h3>
            <p><strong>Address:</strong> {selectedLocation.address}</p>
            <p><strong>Latitude:</strong> {selectedLocation.latitude}</p>
            <p><strong>Longitude:</strong> {selectedLocation.longitude}</p>
          </div>
        </div>

        {/* AddressMap Demo */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">AddressMap Component</h2>
          <p className="text-gray-600">
            Component bản đồ với khả năng tìm kiếm và chọn vị trí
          </p>
          
          <AddressMap
            address={formData.address}
            latitude={formData.latitude}
            longitude={formData.longitude}
            onLocationSelect={(location) => {
              setFormData({
                address: location.address,
                latitude: location.latitude,
                longitude: location.longitude
              });
            }}
            height="300px"
            showSearch={true}
            className="border rounded-lg"
          />
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Selected Location:</h3>
            <p><strong>Address:</strong> {formData.address || 'Chưa chọn'}</p>
            <p><strong>Latitude:</strong> {formData.latitude || 'Chưa chọn'}</p>
            <p><strong>Longitude:</strong> {formData.longitude || 'Chưa chọn'}</p>
          </div>
        </div>
      </div>

      {/* Test Controls */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Test Controls</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setSelectedLocation({
              latitude: 21.0285,
              longitude: 105.8542,
              address: 'Hanoi, Vietnam'
            })}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Set Hanoi
          </button>
          
          <button
            onClick={() => setSelectedLocation({
              latitude: 10.8231,
              longitude: 106.6297,
              address: 'Ho Chi Minh City, Vietnam'
            })}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Set Ho Chi Minh City
          </button>
          
          <button
            onClick={() => setSelectedLocation({
              latitude: 16.0544,
              longitude: 108.2022,
              address: 'Da Nang, Vietnam'
            })}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Set Da Nang
          </button>
        </div>
        
        <div className="mt-4">
          <input
            type="text"
            placeholder="Nhập địa chỉ để test..."
            className="w-full px-3 py-2 border border-gray-300 rounded"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                setSelectedLocation({
                  latitude: null,
                  longitude: null,
                  address: e.target.value
                });
              }
            }}
          />
          <p className="text-sm text-gray-600 mt-1">
            Nhập địa chỉ và nhấn Enter để test geocoding
          </p>
        </div>
      </div>

      {/* Features List */}
      <div className="mt-8 p-6 bg-green-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Features</h3>
        <ul className="space-y-2">
          <li>✅ Sử dụng OpenStreetMap (miễn phí)</li>
          <li>✅ LeafletJS cho hiệu suất tốt</li>
          <li>✅ Tự động geocoding địa chỉ</li>
          <li>✅ Interactive markers</li>
          <li>✅ Search functionality</li>
          <li>✅ Responsive design</li>
          <li>✅ Loading states</li>
          <li>✅ Error handling</li>
          <li>✅ Cache system</li>
        </ul>
      </div>
    </div>
  );
};

export default MapDemo;
