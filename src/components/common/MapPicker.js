// src/components/common/MapPicker.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

export default function MapPicker({
  initialLocation,
  onLocationSelect,
  readOnly = false,
  height = 280,
}) {
  const { colors } = useTheme();
  const mapRef = useRef(null);
  const [location, setLocation] = useState(
    initialLocation || {
      latitude: 35.6892,
      longitude: 51.3890,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }
  );
  const [address, setAddress] = useState('در حال دریافت آدرس...');
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa`,
        {
          headers: {
            'User-Agent': 'ZibanoApp/1.0',
          },
        }
      );
      const data = await response.json();
      return data.display_name || 'آدرس یافت نشد';
    } catch (error) {
      console.log('Error getting address:', error);
      return 'خطا در دریافت آدرس';
    }
  };

  useEffect(() => {
    const initLocation = async () => {
      if (initialLocation && initialLocation.latitude && initialLocation.longitude) {
        setLocation(initialLocation);
        const addr = await getAddressFromCoordinates(initialLocation.latitude, initialLocation.longitude);
        setAddress(addr);
      } else {
        const addr = await getAddressFromCoordinates(location.latitude, location.longitude);
        setAddress(addr);
      }
      setLoading(false);
    };
    initLocation();
  }, []);

  const handleMapPress = async (e) => {
    if (readOnly) return;
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const newLocation = {
      latitude,
      longitude,
      latitudeDelta: location.latitudeDelta,
      longitudeDelta: location.longitudeDelta,
    };
    setLocation(newLocation);
    setLoading(true);
    const addr = await getAddressFromCoordinates(latitude, longitude);
    setAddress(addr);
    setLoading(false);
    if (onLocationSelect) {
      onLocationSelect(newLocation, addr);
    }
  };

  return (
    <View style={[s.container, { height }]}>
      <MapView
        ref={mapRef}
        style={s.map}
        mapType="none"
        region={location}
        onPress={handleMapPress}
        scrollEnabled={!readOnly}
        zoomEnabled={!readOnly}
        rotateEnabled={false}
        onMapReady={() => setMapReady(true)}
      >
        <UrlTile
          urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        <Marker
          coordinate={location}
          draggable={!readOnly}
          onDragEnd={async (e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            const newLocation = {
              ...location,
              latitude,
              longitude,
            };
            setLocation(newLocation);
            setLoading(true);
            const addr = await getAddressFromCoordinates(latitude, longitude);
            setAddress(addr);
            setLoading(false);
            if (onLocationSelect) {
              onLocationSelect(newLocation, addr);
            }
          }}
        >
          <View style={[s.markerContainer, { backgroundColor: colors.primary }]}>
            <Icon name="location-on" size={24} color="#fff" />
          </View>
        </Marker>
      </MapView>
      
      <View style={[s.bottomBar, { backgroundColor: colors.cardBackground, borderTopColor: colors.border }]}>
        <Icon name="place" size={18} color={colors.primary} />
        <View style={s.addressInfo}>
          {loading ? (
            <View style={s.loadingRow}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[s.addressText, { color: colors.textSecondary }]}>در حال دریافت آدرس...</Text>
            </View>
          ) : (
            <>
              <Text style={[s.addressLabel, { color: colors.textMain }]}>موقعیت انتخاب‌شده</Text>
              <Text style={[s.addressText, { color: colors.textSecondary }]} numberOfLines={2}>
                {address}
              </Text>
            </>
          )}
        </View>
      </View>
      
      {!readOnly && (
        <View style={[s.hintBadge, { backgroundColor: colors.primary }]}>
          <Icon name="touch-app" size={14} color="#fff" />
          <Text style={s.hintText}>تپ یا کشیدن مارکر</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { width: '100%', borderRadius: 16, overflow: 'hidden', borderWidth: 1 },
  map: { flex: 1 },
  markerContainer: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
  bottomBar: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1 },
  addressInfo: { flex: 1, gap: 2 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addressLabel: { fontSize: 12, fontFamily: 'Vazir-Bold' },
  addressText: { fontSize: 11, fontFamily: 'Vazir', lineHeight: 16 },
  hintBadge: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 4 },
  hintText: { color: '#fff', fontSize: 11, fontFamily: 'Vazir-Bold' },
});