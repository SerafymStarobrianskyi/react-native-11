import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
  cleanup,
} from "@testing-library/react-native";
import * as Location from "expo-location";
import App from "../App";
import { animateCameraMock } from "../__mocks__/react-native-maps";

const mockLatitude = 10 + Math.random() * 50;
const mockLongitude = 10 + Math.random() * 50;
const mockCorrectAddress = "New Address";
const mockIncorrectAddress = "InCorrectAddres";

jest.mock("expo-location", () => ({
  PermissionStatus: {
    GRANTED: "granted",
    UNDETERMINED: "undetermined",
    DENIED: "denied",
  },
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" })
  ),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: {
        accuracy: 19.70800018310547,
        altitude: 0,
        altitudeAccuracy: 0.5,
        heading: 0,
        latitude: mockLatitude,
        longitude: mockLongitude,
        speed: 0,
      },
      mocked: false,
      timestamp: 1709656737323,
    })
  ),
  geocodeAsync: jest.fn((address) => {
    if (address === mockCorrectAddress) {
      return Promise.resolve([{ latitude: 42, longitude: 24 }]);
    } else Promise.resolve([]);
  }),
}));

describe("Map should be rendered", () => {
  afterEach(() => {
    cleanup();
    animateCameraMock.mockClear();
  });
  it("should show error 'Permission to access location was denied' when location permissions are denied", async () => {
    Location.requestForegroundPermissionsAsync.mockImplementationOnce(() =>
      Promise.resolve({ status: "denied" })
    );
    render(<App />);
    await waitFor(() => {
      expect(
        screen.getByText("Permission to access location was denied")
      ).toBeTruthy();
    });
  }, 7000);

  it("should not show error 'Permission to access location was denied' when location permissions are  granted", async () => {
    render(<App />);
    await waitFor(() => {
      expect(
        screen.queryByText("Permission to access location was denied")
      ).toBeNull();
    });
  });

  it("should render user location and show my location button", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("center-on-user-btn")).toBeTruthy();
      expect(screen.getByTestId("user-location")).toBeTruthy();
    });
  });

  it("should not display any markers, polylynes and 'Center the marker' button on the first render", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.queryByText("Center the marker")).toBeNull();
      expect(screen.queryByText("Center the marker")).toBeNull();
      expect(screen.queryByText("Center the marker")).toBeNull();
      expect(screen.queryByTestId("polyline-start")).toBeNull();
      expect(screen.queryByTestId("polyline-end")).toBeNull();
      expect(screen.queryByTestId("marker-latitude")).toBeNull();
      expect(screen.queryByTestId("marker-longitude")).toBeNull();
    });
  });

  it("should show error 'Address not found' when entered address is invalid", async () => {
    render(<App />);
    const addressInput = screen.getByPlaceholderText("Enter the address");
    await act(async () => {
      fireEvent.changeText(addressInput, mockIncorrectAddress);
    });
    const addButton = screen.getByText("Add marker");
    await act(async () => {
      fireEvent.press(addButton);
    });
    expect(screen.getByText("Address not found")).toBeTruthy();
  });

  it("should animate the map's view to center on the user's current location on the first render", async () => {
    render(<App />);
    await waitFor(() => {
      expect(animateCameraMock).toHaveBeenCalledTimes(1);
      expect(animateCameraMock).toHaveBeenCalledWith(
        expect.objectContaining({
          center: expect.objectContaining({
            latitude: mockLatitude,
            longitude: mockLongitude,
          }),
          zoom: 15,
        }),
        { duration: 2000 }
      );
    });
  });

  it("allows the user to enter an address", async () => {
    render(<App />);

    const addressInput = screen.getByPlaceholderText("Enter the address");
    await act(() => {
      fireEvent.changeText(addressInput, mockCorrectAddress);
    });
    await waitFor(() => {
      expect(screen.getByDisplayValue(mockCorrectAddress)).toBeTruthy();
    });
  });

  it("should display marker at entered coordinates after click 'Add Marker' button", async () => {
    render(<App />);

    const addressInput = screen.getByPlaceholderText("Enter the address");
    await act(async () => {
      fireEvent.changeText(addressInput, mockCorrectAddress);
    });
    const addButton = screen.getByText("Add marker");
    await act(async () => {
      fireEvent.press(addButton);
    });
    await waitFor(() => {
      expect(Location.geocodeAsync).toHaveBeenCalledWith(mockCorrectAddress);
      const latitude = screen.getByTestId("marker-latitude");
      const longitude = screen.getByTestId("marker-longitude");
      expect(latitude).toBeTruthy();
      expect(latitude).toHaveTextContent("latitude-42");
      expect(longitude).toBeTruthy();
      expect(longitude).toHaveTextContent("longitude-24");
    });
  });

  it("should display polyline from user loaction to the entered coordinates after click 'Add Marker' button", async () => {
    render(<App />);
    const addressInput = screen.getByPlaceholderText("Enter the address");
    await act(async () => {
      fireEvent.changeText(addressInput, mockCorrectAddress);
    });
    const addButton = screen.getByText("Add marker");
    await act(async () => {
      fireEvent.press(addButton);
    });
    await waitFor(() => {
      const polylineStart = screen.getByTestId("polyline-start");
      const polylineEnd = screen.getByTestId("polyline-end");
      expect(polylineStart).toBeTruthy();
      expect(polylineStart).toHaveTextContent(
        JSON.stringify({ latitude: mockLatitude, longitude: mockLongitude })
      );
      expect(polylineEnd).toBeTruthy();
      expect(polylineEnd).toHaveTextContent(`{"latitude":42,"longitude":24}`);
    });
  });
  it("should animate the map's view to new marker coordinstes after click 'Add Marker' button", async () => {
    render(<App />);
    const addressInput = screen.getByPlaceholderText("Enter the address");
    await act(async () => {
      fireEvent.changeText(addressInput, mockCorrectAddress);
    });
    const addButton = screen.getByText("Add marker");
    await act(async () => {
      fireEvent.press(addButton);
    });
    await waitFor(() => {
      expect(animateCameraMock).toHaveBeenCalledTimes(2);
      expect(animateCameraMock).toHaveBeenCalledWith(
        expect.objectContaining({
          center: expect.objectContaining({
            latitude: 42,
            longitude: 24,
          }),
          zoom: 15,
        }),
        { duration: 2000 }
      );
    });
  });
  it("should animate the map's view to the marker coordinstes after click 'Center the marker' button", async () => {
    render(<App />);
    const addressInput = screen.getByPlaceholderText("Enter the address");
    await act(async () => {
      fireEvent.changeText(addressInput, mockCorrectAddress);
    });
    const addButton = screen.getByText("Add marker");
    await act(async () => {
      fireEvent.press(addButton);
    });
    const centerButton = screen.getByText("Center the marker");
    await act(async () => {
      fireEvent.press(centerButton);
    });
    await waitFor(() => {
      expect(animateCameraMock).toHaveBeenCalledTimes(3);
      expect(animateCameraMock).toHaveBeenCalledWith(
        expect.objectContaining({
          center: expect.objectContaining({
            latitude: 42,
            longitude: 24,
          }),
          zoom: 15,
        }),
        { duration: 2000 }
      );
    });
  });
});
