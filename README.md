# Using locations. Work with maps and locations

## App description

Develop a React Native application that integrates with the expo-location library and Google Maps. The application should accurately display the user's current location, enable the input of an address to add a marker on the map, and allow the map to be centered either on the user's current location or on the newly added marker.

## Requirements:

### Displaying the User Current Location

1. Request and obtain user permission to access their current location using `requestForegroundPermissionsAsync` from `expo-location`.
2. Use `react-native-maps` to retrieve and display the user's current location on the map.
3. On the first render, animate the map's view to center on the user's current location. Set the initial zoom level to `ZOOM_LEVEL = 15`. Ensure this animation is smooth, with an animation duration of `ANIMATION_DURATION = 2000` milliseconds.
4. Incorporate a built-in button from MapView that allows users to re-center the map on their current location whenever it is moved away.
5. Employ `PROVIDER_GOOGLE` for map rendering.

### Address Input and Marker Placement

1. Implement a `TextInput` component with `PlaceholderText` **"Enter the address"** that enables users to type in an address.
2. Add a button labeled **"Add marker"**. When this button is pressed, the app should:

- Use the `geocodeAsync` method from `expo-location` to convert the entered address into geographic coordinates.
- Place a marker on the map at the obtained coordinates.
- If there is an existing marker from a previous address entry, remove that marker before adding the new one.

3. Automatically draw a `Polyline` that connects the user's current location to the new marker, illustrating a direct path between these two locations.
4. Ensure that if a user enters another address and presses the **"Add marker"** button again, the previous marker is removed and replaced with a new marker corresponding to the latest address. The `Polyline` should also update to connect the user's current location to the new marker.

### Centering the Map

1. Implement functionality to smoothly transition the map's view to center on the newly added marker. This centering should use a practical zoom level, suggested to be `ZOOM_LEVEL = 15`, to provide a detailed view of the marker's surroundings. Ensure the animation to this view is smooth, with a duration of `ANIMATION_DURATION = 2000` milliseconds. Activate this feature both when the **"Center the marker"** button is clicked and immediately after a new marker is added to the map.
2. The **"Center the marker"** button should be made visible only when there is a valid marker on the map.

### Error Handling and Permissions

1. Implement error handling for scenarios where:

- The user's current location cannot be fetched due to errors in the location-fetching process. Display error message **"Permission to access location was denied"** to inform the user of the issue.
- The address entered by the user cannot be geocoded into latitude and longitude coordinates. In such cases, display the error message **"Address not found"** to inform the user that the entered address is invalid or cannot be located.

## Demo

You can see some video-examples how app should works:

- [Error when location service is denied](./media/denied.mp4)
- [Error when address not found](./media/not_found.mp4)
- [Adding markers](./media/add_markers.mp4)

## Test

Do not make any changes in tests and **mocks** folders. Entry point of app is [App.js](./App.js) file. To run tests use `npm test`.
