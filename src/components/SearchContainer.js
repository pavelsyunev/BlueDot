import {useContext} from 'react'
import { MapsContext } from '../contexts/MapsContext';
import SearchInputContainer from "./SearchInputContainer";
import {FaRegClock, FaWalking} from "react-icons/fa"


const SearchContainer = () => {
    const {
        handleFetchDirections,
        handleCleanSelectedLocations,
        duration,
        distance,
        // setTrackingMode,
        // setCenter
    } = useContext(MapsContext);

    const buttonLabel = duration && distance ? "Clear" : "GO";
    const handleButtonClick = () => {
        if(duration && distance) {
            handleCleanSelectedLocations()
            // setTrackingMode('getCurrentPosition')
        } else {
            handleFetchDirections()
            // setTrackingMode('watchPosition')
            // setCenter(null)
        }
    }

    return (
        <div className="flex flex-col w-11/12 rounded shadow-md bg-white absolute z-50 m-6 p-4">
            <div className="flex gap-6 mb-4">
                <div className="w-full mt-5">
                    <SearchInputContainer />
                </div>

                <button
                    className="bg-blue-700 w-1/4 rounded mt-5 h-[38px] text-white font-extrabold shadow-md"
                    type="button"
                    // disabled={false}
                    onClick={handleButtonClick}
                >
                    {buttonLabel}
                </button>
            </div>

            {duration && distance && (<div className="flex content-center justify-between  mb-4 text-gray-700">
                <div className="flex content-center gap-6">
                    <div className="flex items-center w-6 h-6 rounded-full bg-red-600"></div>
                    {'-'}
                    <div className="flex items-center">
                        <FaRegClock size={22}/>
                        <p className="ml-2">{duration}</p>
                    </div>
                    <div className="flex items-center">
                        <FaWalking size={22}/>
                        <p className="ml-2">{distance}</p>
                    </div>
                </div>
            </div>)}
        </div>
    )
}

export default SearchContainer