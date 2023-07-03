import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    DirectionsRenderer
} from '@react-google-maps/api'
import {useEffect, useContext} from 'react'
import { MapsContext } from '../contexts/MapsContext';
import SearchContainer from "./SearchContainer";
import MyLocationContainer from "./MyLocationContaiter";
import Errors from "./Errors";

const libraries = ['places']
const MapContainer = () => {
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries
    })

    const {
        setMap,
        handleMoveToPin,
        handleMapPlaceInfo,
        userLocation,
        selectedTo,
        directions,
        handleCleanSelectedLocations,
        trackLocation,
        appError,
        center,
    } = useContext(MapsContext);

    useEffect(() => {
        trackLocation();
    }, [trackLocation]);

    if (!isLoaded) {
        return
    }

    return (
        <>
            <SearchContainer/>
            {appError && < Errors errors={appError} />}
            <GoogleMap
                center={center}
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
                userCurrentLocation={() => {
                    handleMoveToPin(userLocation)
                }}
                isUserCurrentLocation={!!userLocation}
            />
        </>
    )
}

export default MapContainer