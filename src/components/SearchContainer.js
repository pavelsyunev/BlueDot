import SearchInputContainer from "./SearchInputContainer";
import { FaRegClock, FaWalking } from "react-icons/fa"
const SearchContainer = ({ setSelectedTo, moveToPin, clearLocations, fetchDirections, duration, distance }) => {
    return (
        <div className="flex flex-col w-11/12 rounded shadow-md bg-white absolute z-50 m-6 p-4">
            <div className="flex gap-6 mb-4">
                <div className="w-full mt-5">
                    <SearchInputContainer setSelected={setSelectedTo} moveToPin={moveToPin} clearLocations={clearLocations}/>
                </div>

                <button
                    className="bg-blue-700 w-1/4 rounded mt-5 h-[38px] text-white font-extrabold shadow-md"
                    type="button"
                    disabled={false}
                    onClick={fetchDirections}
                >
                    GO
                </button>
            </div>
            {duration && distance && (<div className="flex content-center gap-6 mb-4 text-gray-700">
                <div className="flex">
                    <FaRegClock size={22}/>
                    <p className="ml-2">{duration}</p>
                </div>
                <div className="flex">
                    <FaWalking size={22}/>
                    <p className="ml-2">{distance}</p>
                </div>
            </div>)}
        </div>
    )
}

export default SearchContainer