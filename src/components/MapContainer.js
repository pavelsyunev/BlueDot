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
        userLocation,
        selectedTo,
        directions,
        trackLocation,
        appError,
        center,
        handlePlaceIconClick
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
                onClick={placeIcon => handlePlaceIconClick(placeIcon)}
            >
                {!!userLocation && (<Marker position={userLocation} label='A'/>)}
                {!!selectedTo && (<Marker position={selectedTo} label='B'/>)}

                {directions &&
                    directions.routes.map((route, index) => {
                        const color = index === 0 ? '#b91c1c' : 'rgba(29, 78, 216, 0.3)'; // Set different colors based on the route index

                        return (
                            <DirectionsRenderer
                                key={index}
                                options={{
                                    suppressMarkers: true,
                                    directions: directions,
                                    routeIndex: index,
                                    polylineOptions: {
                                        strokeColor: color,
                                    },
                                }}
                            />
                        );
                    })}
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