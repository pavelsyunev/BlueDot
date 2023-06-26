import React, { createContext, useState } from 'react';

export const MapsContext = createContext();

export const MapsProvider = ({ children }) => {
    const [map, setMap] = useState( /** @type google.maps.GoogleMap */ (null))
    const [mapPlaceInfo, setMapPlaceInfo] = useState({placeName: null, placeLat: null, placeLng: null})
    const [userLocation, setUserLocation] = useState(null)
    const [selectedTo, setSelectedTo] = useState(null);
    const [directions, setDirections] = useState(null);
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
    const [searchInputValue, setSearchInputValue] = useState(false)
    const [trackingMode, setTrackingMode] = useState('getCurrentPosition');

    const handleMoveToPin = (pinLocation) => {
        setTimeout(() => {
            map.panTo(pinLocation);
        }, 100)
    }

    const handleMapPlaceInfo = (placeId) => {
        const placesService = new window.google.maps.places.PlacesService(map);

        placesService.getDetails(
            {
                placeId: placeId,
                fields: ['name', 'geometry.location'],
            },
            (place, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    const placeName = place.name;
                    const placeLat = place.geometry.location.lat();
                    const placeLng = place.geometry.location.lng();

                    // console.log('Place: ', place)
                    // console.log('Place Name: ', placeName);
                    // console.log('Latitude: ', placeLat);
                    // console.log('Longitude: ', placeLng);

                    // Use the place information as needed
                    setMapPlaceInfo({placeName: placeName, placeLat: placeLat, placeLng: placeLng});
                    setSelectedTo({ lat: placeLat, lng: placeLng });
                    handleMoveToPin({ lat: placeLat, lng: placeLng });
                }
            }
        );
    }

    const handleFetchDirections = () => {
        if (!selectedTo) return;

        // eslint-disable-next-line no-undef
        const service = new google.maps.DirectionsService();

        service.route(
            {
                origin: userLocation,
                destination: selectedTo,
                // eslint-disable-next-line no-undef
                travelMode: google.maps.TravelMode.WALKING,
            },
            (result, status) => {
                if (status === "OK" && result) {
                    setDirections(result);
                    setDistance(result.routes[0].legs[0].distance.text)
                    setDuration(result.routes[0].legs[0].duration.text)
                }
            }
        );
    };

    const handleCleanSelectedLocations = () => {
        setSelectedTo(null);
        setDirections(null)
        setDistance('')
        setDuration('')
        // ?
        setSearchInputValue(false)
        setMapPlaceInfo({placeName: null, placeLat: null, placeLng: null})
    }

    const sharedState = {
        map,
        setMap,
        handleMoveToPin,
        mapPlaceInfo,
        handleMapPlaceInfo,
        handleFetchDirections,
        directions,
        distance,
        duration,
        userLocation,
        setUserLocation,
        handleCleanSelectedLocations,
        selectedTo,
        setSelectedTo,
        searchInputValue,
        setSearchInputValue,
        trackingMode,
        setTrackingMode
    };

    return (
        <MapsContext.Provider value={sharedState}>
            {children}
        </MapsContext.Provider>
    );
};