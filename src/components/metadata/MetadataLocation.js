import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Typography, TextField } from '@material-ui/core';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import config from './../../config';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import AutocompleteLocation from './AutocompleteLocation';

// required for the Leaflet map pin icon images
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

function MetadataLocation({
  node,
  classes,
  EditButton,
  DeleteButton,
  CancelButton,
  SaveButton,
  AnnotatorInformation,
  FieldInformation,
  hasData,
  isEditing,
  metadataValue,
  setMetadataValue,
}) {
  const [firstMapRender, setFirstMapRender] = React.useState(true);
  const [map, setMap] = React.useState({});
  const [marker, setMarker] = React.useState({});
  let latitude, longitude, name;
  try {
    const parsedNode = JSON.parse(
      JSON.parse(node.first_response?.content)[0].value,
    );
    [latitude, longitude] = parsedNode.geometry.coordinates;
    name = parsedNode.properties.name;
  } catch {
    latitude = null;
    longitude = null;
  }
  const [nameText, setNameText] = React.useState(name);
  const [coordinates, setCoordinates] = React.useState({
    latitude,
    longitude,
    text: `${latitude},${longitude}`,
    displayText: `${latitude},${longitude}`,
    error: false,
  });

  if (!coordinates.error && nameText) {
    try {
      setMetadataValue(
        JSON.stringify({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [coordinates.latitude, coordinates.longitude],
          },
          properties: {
            name: nameText,
          },
        }),
      );
    } catch {
      setMetadataValue('{}');
    }
  }
  const mutationPayload = {
    annotation_type: 'task_response_geolocation',
    set_fields: `{"response_geolocation":${JSON.stringify(metadataValue)}}`,
  };

  function handleLatLngChange(e) {
    const parsedLatLng = e.target.value.match(
      /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/,
    );
    if (parsedLatLng === null) {
      setCoordinates({
        latitude,
        longitude,
        text: '',
        error: true,
        displayText: e.target.value,
      });
    } else {
      latitude = parsedLatLng[1];
      longitude = parsedLatLng[3];
      setCoordinates({
        latitude,
        longitude,
        text: `${latitude},${longitude}`,
        displayText: `${latitude},${longitude}`,
        error: false,
      });
    }
  }

  function handleNameChange(e) {
    setNameText(e.target.value);
  }

  function handleMarkerMove(e) {
    let latitude = e.target._latlng.lat;
    let longitude = e.target._latlng.lng;
    setCoordinates({
      latitude,
      longitude,
      text: `${latitude},${longitude}`,
      displayText: `${latitude},${longitude}`,
      error: false,
    });
  }

  React.useEffect(() => {
    if (isEditing && firstMapRender) {
      setFirstMapRender(false);
      let tempMap = L.map('map-edit');
      let defaultCenter, basemap;
      const defaultZoom = 10;

      defaultCenter = [coordinates.latitude, coordinates.longitude];
      basemap = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        {
          attribution:
            'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
        },
      );
      let tempMarker = L.marker(defaultCenter, {
        draggable: true,
        autoPan: true,
        autoPanPadding: L.point(20, 20),
        autoPanSpeed: 10,
      });
      tempMap.setView(defaultCenter, defaultZoom);
      // overriding property on map object
      tempMap.defaultZoom = defaultZoom;
      basemap.addTo(tempMap);
      tempMarker.addTo(tempMap);
      tempMarker.on('moveend', handleMarkerMove);
      setMap(tempMap);
      setMarker(tempMarker);
    } else if (isEditing && !firstMapRender) {
      marker.setLatLng([coordinates.latitude, coordinates.longitude]);
      map.setView([coordinates.latitude, coordinates.longitude], map.getZoom());
    } else if (!isEditing && !firstMapRender) {
      setFirstMapRender(true);
    }
  });

  return (
    <>
      <FieldInformation />
      {hasData && !isEditing ? (
        <>
          <Typography variant="body1" className={classes.value}>
            {node.first_response_value}
          </Typography>
          <img
            className={classes.mapImg}
            src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${longitude},${latitude},10,0,0/500x500?access_token=${config.mapboxApiKey}`}
            alt=""
          />
          <AnnotatorInformation />
          <EditButton />
          <DeleteButton />
        </>
      ) : (
        <>
          <AutocompleteLocation {...{ setNameText, setCoordinates, map }} />
          <TextField
            fullWidth
            label={
              <FormattedMessage
                id="metadata.location.customize"
                defaultMessage="Customize place name"
                description="This is a label that appears on a text field, related to a pin on a map. The user may type any text of their choice here and name the place they are pinning. They can also modify suggested place names here."
              />
            }
            variant="outlined"
            value={nameText}
            onChange={handleNameChange}
            error={!nameText}
            helperText={
              !nameText ? 'Please enter a name for this location.' : null
            }
          />
          <TextField
            fullWidth
            label={
              <FormattedMessage
                id="metadata.location.coordinates"
                defaultMessage="Latitude, longitude"
                description="This is a label that appears on a text field, related to a pin on a map. This contains the latitude and longitude coordinates of the map pin. If the user changes these numbers, the map pin moves. If the user moves the map pin, the numbers update to reflect the new pin location."
              />
            }
            variant="outlined"
            value={coordinates.displayText}
            onChange={handleLatLngChange}
            error={coordinates.error}
            helperText={
              coordinates.error ? (
                <FormattedMessage
                  id="metadata.location.coordinates.helper"
                  defaultMessage="Should be a comma-separated pair of latitude and longitude coordiantes like '-12.9, -38.15'. Drag the map pin if you are having difficulty."
                  description="This is a helper message that appears when someone enters text in the 'Latitude, longitude' text field that cannot be parsed as a valid pair of latitude and longitude coordinates. It tells the user that they need to provide valid coordinates and gives an example. It also tells them that they can do a drag action with the mouse on the visual map pin as an alternative to entering numbers in this field."
                />
              ) : null
            }
          />
          <div id="map-edit" className={classes.map}></div>
          <br />
          <CancelButton />
          <SaveButton
            {...{ mutationPayload }}
            disabled={coordinates.error || !nameText}
          />
        </>
      )}
    </>
  );
}

MetadataLocation.propTypes = {
  node: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  EditButton: PropTypes.element.isRequired,
  DeleteButton: PropTypes.element.isRequired,
  CancelButton: PropTypes.element.isRequired,
  SaveButton: PropTypes.element.isRequired,
  AnnotatorInformation: PropTypes.element.isRequired,
  FieldInformation: PropTypes.element.isRequired,
  hasData: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  metadataValue: PropTypes.string.isRequired,
  setMetadataValue: PropTypes.func.isRequired,
};

export default MetadataLocation;
