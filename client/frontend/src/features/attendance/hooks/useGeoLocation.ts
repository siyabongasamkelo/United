import { useState } from "react";

interface GeoLocationState {
  loading: boolean;
  error: string | null;
}

export const useGeoLocation = () => {
  const [state, setState] = useState<GeoLocationState>({
    loading: false,
    error: null,
  });

  const getCoordinates = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setState({
          loading: false,
          error: "GPS not supported on this browser",
        });
        return reject("Not supported");
      }

      setState({ loading: true, error: null });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({ loading: false, error: null });
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          let msg = "Failed to capture location";
          if (error.code === error.PERMISSION_DENIED) {
            msg = "Please enable GPS/location access to check in.";
          }
          setState({ loading: false, error: msg });
          reject(msg);
        },
        { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 },
      );
    });
  };

  return { ...state, getCoordinates };
};
