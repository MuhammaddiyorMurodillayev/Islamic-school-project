import { useRef } from 'react';
import {
    // GoogleMap,
    LoadScript,
    Autocomplete,
    // Marker,
} from '@react-google-maps/api';

// const containerStyle = {
//     width: '100%',
//     height: '300px',
// };

// const centerDefault = {
//     lat: 40.367474,
//     lng: -82.996216,
// };

interface SearchWithGoogleMapProp {
    formData: {
        residencyAddress: string
    },
    handleChange: () => any,
    isNotFilled: boolean
}

const SearchWithGoogleMap: React.FC<SearchWithGoogleMapProp> = ({ formData, isNotFilled, handleChange }) => {

    const apiKey = 'AIzaSyCFt3jyUQy9gnKN3i5LjbiHaduMcGQxBjY';

    // const [center, setCenter] = useState(centerDefault);
    // const [markerPosition, setMarkerPosition] = useState(centerDefault);

    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    // const onPlaceChanged = () => {
    //     const place = autocompleteRef.current?.getPlace();
    //     if (place && place.geometry && place.geometry.location) {
    //         const location = place.geometry.location;
    //         const lat = location.lat();
    //         const lng = location.lng();
    //         setCenter({ lat, lng });
    //         setMarkerPosition({ lat, lng });
    //     } else {
    //         console.log('Joy topilmadi');
    //     }
    // };

    return (
        <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
            <div style={{ marginBottom: '10px' }}>
                <Autocomplete onLoad={onLoad} >
                    <input
                    onChange={handleChange}
                        className={
                            isNotFilled && formData.residencyAddress.trim() === ''
                                ? 'w-full px-3 py-2 border  rounded-md focus:outline-none shadow focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500'
                                : 'w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
                        } type="text"
                        placeholder="Joy nomini kiriting..."
                    />
                </Autocomplete>
            </div>

            {/* <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
                <Marker position={markerPosition} />
            </GoogleMap> */}
        </LoadScript>
    );
};

export default SearchWithGoogleMap;
