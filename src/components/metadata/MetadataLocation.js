import React from 'react';
import PropTypes from 'prop-types';
import { Typography, TextField } from '@material-ui/core';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import config from './../../config';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

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
  hasData,
  isEditing,
  metadataValue,
  setMetadataValue,
}) {
  const [firstMapRender, setFirstMapRender] = React.useState(true);
  const [map, setMap] = React.useState({});
  let latitude, longitude;
  try {
    [latitude, longitude] = JSON.parse(
      JSON.parse(node.first_response?.content)[0].value,
    ).geometry.coordinates;
  } catch {
    latitude = null;
    longitude = null;
  }
  const [coordinates, setCoordinates] = React.useState({
    latitude,
    longitude,
  });
  const mutationPayload = {
    annotation_type: 'task_response_geolocation',
    set_fields: `{"response_free_text":"${metadataValue}"}`,
  };

  function handleLatLngChange(e) {
    latitude = 46;
    longitude = -68;
    setCoordinates({ latitude, longitude });
    setMetadataValue(e.target.value);
  }

  console.log('RENDERING', coordinates, map);

  let defaultCenter, basemap, marker;
  const defaultZoom = 10;

  React.useEffect(() => {
    if (isEditing && firstMapRender) {
      setFirstMapRender(false);
      let tempMap = L.map('map-edit');
      defaultCenter = [coordinates.latitude, coordinates.longitude];
      basemap = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        {
          attribution:
            'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
        },
      );
      marker = L.marker(defaultCenter);
      tempMap.setView(defaultCenter, defaultZoom);
      basemap.addTo(tempMap);
      marker.addTo(tempMap);
      setMap(tempMap);
    } else if (isEditing && !firstMapRender) {
      marker = L.marker([coordinates.latitude, coordinates.longitude]);
      map.setView([coordinates.latitude, coordinates.longitude], defaultZoom);
      marker.addTo(map);
    }
  });

  return (
    <>
      {hasData && !isEditing ? (
        <>
          <Typography variant="h6">{node.label}</Typography>
          <Typography variant="body1">{node.description}</Typography>
          <Typography variant="body1" className={classes.value}>
            {node.first_response_value}
          </Typography>
          <img
            src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${longitude},${latitude},10,0,0/400x400?access_token=pk.eyJ1IjoibWVlZGFuIiwiYSI6ImNqNmpsN3F5cDE3M3AyeW1xY2VpaHZybXEifQ.XpDu6rzlVTe0n0N7LAW2AA`}
            alt=""
          />
          <img
            className={classes.profileImage}
            src={node.annotator?.user?.profile_image}
            alt="Profile image"
          />
          <Typography variant="body1">
            Completed by{' '}
            <a
              href={`https://${config.checkWebUrl}/check/user/${node.annotator?.user?.dbid}`}
            >
              {node.annotator?.user?.name}
            </a>
          </Typography>
          <EditButton />
          <DeleteButton />
        </>
      ) : (
        <>
          <Typography variant="h6">{node.label}</Typography>
          <Typography variant="body1">{node.description}</Typography>
          <TextField
            id="metadata-input"
            label="Search the map"
            variant="outlined"
          />
          <TextField
            id="metadata-input"
            label="Customize place name"
            variant="outlined"
          />
          <TextField
            id="metadata-input"
            label="Latitude, longitude"
            variant="outlined"
            value={`${latitude},${longitude}`}
            onChange={handleLatLngChange}
          />
          <div id="map-edit" className={classes.map}></div>
          <br />
          <CancelButton />
          <SaveButton {...{ mutationPayload }} />
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
  hasData: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  metadataValue: PropTypes.string.isRequired,
  setMetadataValue: PropTypes.func.isRequired,
};

export default MetadataLocation;
