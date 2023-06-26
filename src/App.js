import React from 'react';
import {MapsProvider} from "./contexts/MapsContext";
import MapContainer from './components/MapContainer'

const App = () => {
    return (
        <div className="max-w-3xl shadow-xl h-screen mx-auto flex justify-center relative">
            <MapsProvider>
                <MapContainer/>
            </MapsProvider>
        </div>
    );
}

export default App;
