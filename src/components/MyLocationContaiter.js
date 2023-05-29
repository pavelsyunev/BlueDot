import { TbLocationFilled } from "react-icons/tb";

const MyLocationContainer = ({userCurrentLocation, isUserCurrentLocation}) => {
    return (
        <button
            className="rounded-full shadow-md bg-white absolute z-50 bottom-0 right-0 m-6 p-5 border-2 border-blue-500"
            onClick={userCurrentLocation}
            disabled={!isUserCurrentLocation}
        >
            <TbLocationFilled color="#3b82f6" />
        </button>
    )
}

export default MyLocationContainer