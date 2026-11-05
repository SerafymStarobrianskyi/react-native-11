import React from "react";

import { Text, View, Button } from "react-native";

export const animateCameraMock = jest.fn();
const MockMapView = React.forwardRef((props, ref) => {
  React.useImperativeHandle(ref, () => ({
    animateCamera: animateCameraMock,
  }));
  return (
    <View ref={ref}>
      {props.showsUserLocation && <View testID="user-location" />}
      {props.showsMyLocationButton && (
        <Button testID="center-on-user-btn" title="Center on User" />
      )}
      {props.children}
    </View>
  );
});
const Marker = (props) => {
  return (
    <View>
      <Text testID="marker-latitude">latitude-{props.coordinate.latitude}</Text>
      <Text testID="marker-longitude">longitude-{props.coordinate.longitude}</Text>
    </View>
  );
};
const Polyline = (props) => {
  return (
    <View>
      <View testID="polyline-start">
        {JSON.stringify(props.coordinates[0])}
      </View>
      <Text testID="polyline-end">{JSON.stringify(props.coordinates[1])}</Text>
    </View>
  );
};

MockMapView.Marker = Marker;
MockMapView.Polyline = Polyline;

export default MockMapView;
export { Marker, Polyline };
