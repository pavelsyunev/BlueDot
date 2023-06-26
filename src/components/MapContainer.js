import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    DirectionsRenderer
} from '@react-google-maps/api'
import {useState, useEffect, useContext} from 'react'
import { MapsContext } from '../contexts/MapsContext';
import SearchContainer from "./SearchContainer";
import MyLocationContainer from "./MyLocationContaiter";
import Errors from "./Errors";

const MapContainer = () => {
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    })

    const { setMap, handleMoveToPin, handleMapPlaceInfo, userLocation, setUserLocation, selectedTo, directions, handleCleanSelectedLocations } = useContext(MapsContext);

    const [appError, setAppError] = useState(null)

    useEffect(() => {
        let watchId;
        const trackLocation = () => {
            if (navigator.geolocation) {
                const options = {
                    enableHighAccuracy: true,
                    maximumAge: 0
                };
                watchId = navigator.geolocation.watchPosition(showPosition, errorHandler, options);
                // setAppError(null)
            } else {
                setAppError("Geolocation is not supported by this browser.");
            }
        };

        const showPosition = (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setUserLocation({lat: latitude, lng: longitude})
        };

        const errorHandler = (error) => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    setAppError("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    setAppError("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    setAppError("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    setAppError("An unknown error occurred.");
                    break;
            }
        };

        trackLocation();

        // Clean up the geolocation watcher when the component unmounts
        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [setUserLocation]);

    if (!isLoaded) {
        return
    }

    return (
        <>
            <SearchContainer/>
            {appError && < Errors errors={appError} />}
            <GoogleMap
                center={userLocation}
                zoom={15}
                mapContainerStyle={{width: '100%', height: '100%'}}
                options={{
                    mapId: "578cfa95df6268e9",
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    clickableIcons: true
                }}
                onLoad={map => setMap(map)}
                onClick={placeIcon => {
                    handleCleanSelectedLocations()
                    handleMapPlaceInfo(placeIcon.placeId)
                }}
            >
                {!!userLocation && (<Marker position={userLocation} label='A'/>)}
                {!!selectedTo && (<Marker position={selectedTo} label='B'/>)}
                {directions && (
                    <DirectionsRenderer directions={directions} options={{suppressMarkers: true}}/>
                )}
            </GoogleMap>
            <MyLocationContainer
                userCurrentLocation={() => handleMoveToPin(userLocation)}
                isUserCurrentLocation={!!userLocation}
            />
        </>
    )
}

export default MapContainer