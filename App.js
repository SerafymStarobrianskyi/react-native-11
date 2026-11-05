import React from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";

const ZOOM_LEVEL = 15;
const ANIMATION_DURATION = 2000;

export default function App() {
  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Text>MAP</Text>
      </View>
      <TextInput style={styles.input} placeholder="Enter the address" />
      <View style={styles.buttonContainer}>
        <Button title="Add marker" />
        <Button title="Center the marker" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  map: {
    flex: 1,
    width: "100%",
  },
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
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

