import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    DirectionsRenderer
} from '@react-google-maps/api'
import {useState, useEffect} from 'react'
import SearchContainer from "./SearchContainer";
import MyLocationContainer from "./MyLocationContaiter";

const MapContainer = () => {
    const {isLoaded} = useJsApiLoader({
        // googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        googleMapsApiKey: "AIzaSyBOWIxGdw4KXHzNo31n82ERDjPeOdAhtis",
        libraries: ['places']
    })

    const [map, setMap] = useState( /** @type google.maps.GoogleMap */ (null))
    const [userLocation, setUserLocation] = useState(null)
    const [selectedTo, setSelectedTo] = useState(null);
    const [directions, setDirections] = useState(null);
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            setUserLocation({lat: position.coords.latitude, lng: position.coords.longitude})
            // setSelectedFrom({lat: position.coords.latitude, lng: position.coords.longitude})
        })
    }, []);

    const handleCleanSelectedLocations = () => {
        setSelectedTo(null);
        setDirections(null)
        setDistance('')
        setDuration('')
    }

    const handleMoveToPin = (pinLocation) => {
        setTimeout(() => {
            map.panTo(pinLocation);
        }, 100)
    }

    const fetchDirections = () => {
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

    if (!isLoaded) {
        return
    }

    return (
        <>
            <SearchContainer
                isUserCurrentLocation={!!userLocation}
                setSelectedTo={setSelectedTo}
                moveToPin={handleMoveToPin}
                clearLocations={handleCleanSelectedLocations}
                fetchDirections={fetchDirections}
                distance={distance}
                duration={duration}
            />
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
                    clickableIcons: false
                }}
                onLoad={map => setMap(map)}
            >
                {!!userLocation && (<Marker position={userLocation} label='A'/>)}
                {!!selectedTo && (<Marker position={selectedTo} label='B'/>)}
                {directions && (
                    <DirectionsRenderer directions={directions} options={{suppressMarkers: true}}/>
                )}
            </GoogleMap>
            {/*{!userLocation && <p>Geolocation required for this application</p>}*/}
            <MyLocationContainer
                userCurrentLocation={() => handleMoveToPin(userLocation)}
                isUserCurrentLocation={!!userLocation}
            />
        </>
    )
}

export default MapContainer