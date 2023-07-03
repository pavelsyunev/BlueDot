import {useContext} from 'react'
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { MapsContext } from '../contexts/MapsContext';
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

const SearchInputContainer = () => {
    const { mapPlaceInfo, handleMoveToPin, handleCleanSelectedLocations, setSelectedTo, searchInputValue, setSearchInputValue } = useContext(MapsContext);

    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete();

    const { placeName } = mapPlaceInfo;
    const inputValue = (searchInputValue || !!placeName) ? (searchInputValue ? value : placeName) : ''

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);
        setSelectedTo({ lat, lng });
        handleMoveToPin({ lat, lng })
    }

    const handleInputOnChange = (e) => {
        setValue(e.target.value)
        if(e.target.value === '') handleCleanSelectedLocations()
        if(e.target.value !== '') setSearchInputValue(true)
    }

    return (
        <Combobox onSelect={handleSelect}>
            <ComboboxInput
                value={inputValue}
                onChange={(e) => handleInputOnChange(e)}
                disabled={!ready}
                className="shadow w-full appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder={"Where to go?"}
            />
            {status === "OK" && !placeName && <ComboboxPopover
                className="shadow w-full rounded leading-tight z-50"
            >
                <ComboboxList>
                    {status === "OK" &&
                        data.map(({place_id, description}) => (
                            <ComboboxOption key={place_id} value={description}/>
                        ))}
                </ComboboxList>
            </ComboboxPopover>}
        </Combobox>
    );
}

export default SearchInputContainer