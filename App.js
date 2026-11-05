import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

const ZOOM_LEVEL = 15;
const ANIMATION_DURATION = 2000;

export default function App() {
  const mapRef = useRef(null);
  const geocodeRequest = useRef(0);
  const [address, setAddress] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [marker, setMarker] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [addressError, setAddressError] = useState(null);

  const centerMap = (coordinates) => {
    mapRef.current?.animateCamera(
      { center: coordinates, zoom: ZOOM_LEVEL },
      { duration: ANIMATION_DURATION }
    );
  };

  useEffect(() => {
    let active = true;

    const getLocation = async () => {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission?.status !== Location.PermissionStatus.GRANTED && !permission?.granted) {
          throw new Error("Location permission denied");
        }
        const position = await Location.getCurrentPositionAsync({});
        if (!active) return;
        setLocationPermissionGranted(true);
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      } catch {
        if (active) setLocationError("Permission to access location was denied");
      }
    };

    getLocation();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (userLocation) centerMap(userLocation);
  }, [userLocation]);

  const addMarker = async () => {
    const requestId = ++geocodeRequest.current;
    setMarker(null);
    setAddressError(null);

    const query = address.trim();
    if (!query) {
      setAddressError("Address not found");
      return;
    }

    try {
      const results = await Location.geocodeAsync(query);
      const match = results?.[0];
      if (!Number.isFinite(match?.latitude) || !Number.isFinite(match?.longitude)) {
        throw new Error("Address not found");
      }
      if (requestId !== geocodeRequest.current) return;
      const coordinates = { latitude: match.latitude, longitude: match.longitude };
      setMarker(coordinates);
      centerMap(coordinates);
    } catch {
      if (requestId === geocodeRequest.current) setAddressError("Address not found");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{ latitude: 0, longitude: 0, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
        showsUserLocation={locationPermissionGranted}
        showsMyLocationButton={locationPermissionGranted}
      >
        {marker && <Marker coordinate={marker} />}
        {userLocation && marker && (
          <Polyline coordinates={[userLocation, marker]} strokeColor="#2563eb" strokeWidth={3} />
        )}
      </MapView>
      <View style={styles.controls}>
        {locationError && <Text style={styles.error}>{locationError}</Text>}
        {addressError && <Text style={styles.error}>{addressError}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Enter the address"
          value={address}
          onChangeText={setAddress}
          returnKeyType="search"
          onSubmitEditing={addMarker}
        />
        <View style={styles.buttonContainer}>
          <Button title="Add marker" onPress={addMarker} />
          {marker && <Button title="Center the marker" onPress={() => centerMap(marker)} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1, width: "100%" },
  controls: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  error: { color: "#b91c1c", marginBottom: 8 },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
