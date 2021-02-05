import React, {createElement} from 'react';
import PlacesAutocomplete, {geocodeByAddress} from 'react-places-autocomplete';
import CONSTANTS from '../../lib/constants';

// Variables
const {Global} = CONSTANTS.get();

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChange = (address) => {
    if (this.props.handleChange) {
      this.props.handleChange({address, location: ''});
    }
  };

  handleSelect = (address) => {
    // console.log('Address Selected', address);
    geocodeByAddress(address)
      .then((results) => {
        if (results && results.length > 0) {
          const {location} = results[0].geometry;
          const geoLoc = `${location.lat()}, ${location.lng()}`;
          if (this.props.handleChange) {
            this.props.handleChange({address, location: geoLoc});
          }
        }
      })
      .catch((error) => console.error('Error', error));
  };

  render() {
    const searchOptions = {
      componentRestrictions: {country: 'AU'},
    };
    const styleInputRoot = this.props.fullWidth ? {width: '100%'} : {};
    const styleInputDiv = {
      padding: '7px 7px 5px',
      fontSize: '15px',
      lineHeight: '18px',
      letterSpacing: '.2px',
    };
    return (
      <PlacesAutocomplete
        value={this.props.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        searchOptions={searchOptions}
      >
        {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
          <div style={styleInputRoot}>
            <input
              {...getInputProps({
                placeholder: 'Where to?',
                className: 'location-search-input',
              })}
              style={styleInputDiv}
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
