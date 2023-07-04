import React, {createContext, useState, useEffect, useCallback, useRef} from 'react';

export const MapsContext = createContext();

export const MapsProvider = ({children}) => {
    const [map, setMap] = useState( /** @type google.maps.GoogleMap */ (null))
    const [mapPlaceInfo, setMapPlaceInfo] = useState({placeName: null, placeLat: null, placeLng: null})
    const [userLocation, setUserLocation] = useState(null)
    const [selectedTo, setSelectedTo] = useState(null);
    const [directions, setDirections] = useState(null);
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('');
    const [searchInputValue, setSearchInputValue] = useState(false);
    const [trackingMode, setTrackingMode] = useState('getCurrentPosition');
    const [appError, setAppError] = useState(null);
    const [center, setCenter] = useState(null);

    const watchId = useRef(null);
    const trackLocation = useCallback(() => {
        const clearWatch = () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
                watchId.current = null;
            }
        };

        const showPosition = (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setUserLocation({lat: latitude, lng: longitude});

            if (trackingMode === 'getCurrentPosition') {
                setCenter({lat: latitude, lng: longitude})
                clearWatch()
            }
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
                default:
                    setAppError("An unknown error occurred.");
            }
        };

        if (navigator.geolocation) {
            const options = {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 10000
            };

            if (trackingMode === 'getCurrentPosition') {
                navigator.geolocation.getCurrentPosition(showPosition, errorHandler, options);
            } else if (trackingMode === 'watchPosition') {
                watchId.current = navigator.geolocation.watchPosition(showPosition, errorHandler, options);
            }
        } else {
            setAppError("Geolocation is not supported by this browser.");
        }

        return clearWatch;

    }, [trackingMode, setUserLocation, setAppError]);

    useEffect(() => {
        const clearWatch = trackLocation(); // Invoke trackLocation and capture the returned clearWatch function

        return () => {
            clearWatch(); // Invoke the clearWatch function when the component unmounts
        };
    }, [trackLocation]);

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

                    // Use the place information as needed
                    setMapPlaceInfo({placeName: placeName, placeLat: placeLat, placeLng: placeLng});
                    setSelectedTo({lat: placeLat, lng: placeLng});
                    handleMoveToPin({lat: placeLat, lng: placeLng});
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
                provideRouteAlternatives: true, // Fetch alternative routes
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
        setSearchInputValue(false)
        setMapPlaceInfo({placeName: null, placeLat: null, placeLng: null})
    }

    const handlePlaceIconClick = (placeIcon) => {
        if(!!placeIcon?.placeId) {
            handleCleanSelectedLocations()
            handleMapPlaceInfo(placeIcon?.placeId)
        }
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
        setTrackingMode,
        trackLocation,
        appError,
        setAppError,
        center,
        handlePlaceIconClick,
        setCenter
    };

    return (
        <MapsContext.Provider value={sharedState}>
            {children}
        </MapsContext.Provider>
    );
};