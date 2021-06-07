import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField, CircularProgress } from '@material-ui/core';
import config from './../../config';

function AutocompleteLocation(props) {
  const { setNameText, setCoordinates, map } = props;
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const fetchLocations = async (text) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=${config.mapboxApiKey}&autocomplete=true`,
    );
    const data = await response.json();

    setOptions(
      data.features.map((item) => {
        return {
          name: item.place_name,
          boundingBox: item.bbox,
          center: item.center,
        };
      }),
    );
    setLoading(false);
  };

  React.useEffect(() => {
    let timer;

    if (searchText.length > 2) {
      setLoading(true);
      timer = setTimeout(fetchLocations, 1000, searchText);
    }

    return () => clearTimeout(timer);
  }, [searchText]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      fullWidth
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      filterOptions={(x) => x}
      onInputChange={(e, newInputValue) => {
        setSearchText(newInputValue);
      }}
      onChange={(e, value) => {
        setNameText(value.name);
        setCoordinates({
          latitude: value.center[1],
          longitude: value.center[0],
          text: `${value.center[1]},${value.center[0]}`,
          displayText: `${value.center[1]},${value.center[0]}`,
          error: false,
        });
        if (value.boundingBox) {
          map.fitBounds([
            [value.boundingBox[1], value.boundingBox[0]],
            [value.boundingBox[3], value.boundingBox[2]],
          ]);
        } else {
          map.setZoom(map.defaultZoom);
        }
      }}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={
            <FormattedMessage
              id="metadata.location.search"
              defaultMessage="Search the map"
              description="This is a label that appears on a text field. If the user begins to type a location they will receive a list of suggested place names."
            />
          }
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}

AutocompleteLocation.propTypes = {
  setNameText: PropTypes.func.isRequired,
  setCoordinates: PropTypes.func.isRequired,
  map: PropTypes.object.isRequired,
};

export default AutocompleteLocation;
