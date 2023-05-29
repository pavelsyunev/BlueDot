import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

const SearchInputContainer = ({ setSelected, moveToPin, clearLocations}) => {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete();

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);
        setSelected({ lat, lng });
        moveToPin({ lat, lng })
    }

    return (
        <Combobox onSelect={handleSelect}>
            <ComboboxInput
                value={value}
                onChange={(e) => {
                    setValue(e.target.value)
                    if(e.target.value === '') clearLocations()
                }}
                disabled={!ready}
                className="shadow w-full appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder={"Where to go?"}
            />
            <ComboboxPopover
                className="shadow w-full rounded leading-tight z-50"
            >
                <ComboboxList>
                    {status === "OK" &&
                        data.map(({place_id, description}) => (
                            <ComboboxOption key={place_id} value={description}/>
                        ))}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    );
}

export default SearchInputContainer