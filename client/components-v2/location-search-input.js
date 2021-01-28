import React, {createElement} from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import CONSTANTS from '../../lib/constants';

// Variables
const {Global} = CONSTANTS.get();

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChange = (address) => {
    this.props.handleChange({address, location: ''});
  };

  handleSelect = (address) => {
    console.log('Address Selected', address);
    geocodeByAddress(address)
      .then((results) => {
        if (results && results.length > 0) {
          const {location} = results[0].geometry;
          this.props.handleChange({address, location: location.toString()});
        }
      })
      .catch((error) => console.error('Error', error));
  };

  render() {
    return (
      <PlacesAutocomplete
        value={this.props.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Where to?',
                className: 'location-search-input',
              })}
            />
            <div className='autocomplete-dropdown-container'>
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion, idx) => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? {backgroundColor: '#fafafa', cursor: 'pointer'}
                  : {backgroundColor: '#ffffff', cursor: 'pointer'};
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                    key={`suggestion${idx}`}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

export default LocationSearchInput;
