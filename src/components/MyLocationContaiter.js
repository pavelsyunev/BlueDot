import { TbLocationFilled } from "react-icons/tb";

const MyLocationContainer = ({userCurrentLocation, isUserCurrentLocation}) => {
    return (
        <button
            className="rounded-full shadow-md absolute z-50 bottom-0 right-0 m-6 p-5 bg-blue-700"
            onClick={userCurrentLocation}
            disabled={!isUserCurrentLocation}
        >
            <TbLocationFilled color="white" />
        </button>
    )
}

export default MyLocationContainer