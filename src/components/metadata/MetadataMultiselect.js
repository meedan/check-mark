import React from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@material-ui/core';
import config from './../../config';

function MetadataMultiselect({
  node,
  classes,
  hasData,
  isEditing,
  metadataValue,
  setMetadataValue,
  EditButton,
  DeleteButton,
  CancelButton,
  SaveButton,
}) {
  const mutationPayload = {
    response_multiple_choice: JSON.stringify(metadataValue),
  };
  const options = node.options;
  const [otherText, setOtherText] = React.useState(metadataValue.other);
  const forceUpdate = React.useReducer(() => ({}))[1];

  function handleOtherTextChange(e) {
    setOtherText(e.target.value);
    let tempSelected = metadataValue;
    tempSelected.other = e.target.value;
    setMetadataValue(tempSelected);
  }

  function handleChange(e) {
    let tempSelected = metadataValue;
    if (e.target.name === 'metadata_other') {
      // Other is now not checked so we have to set other to blank string (a "falsey" value)
      if (!e.target.checked) {
        tempSelected.other = '';
        setOtherText('');
      }
    } else {
      // Checked, so we are adding this to the selected sub-array
      if (e.target.checked) {
        tempSelected.selected.push(e.target.value);
      }
      // Not checked so we are removing this from the selected sub-array
      else {
        tempSelected.selected = tempSelected.selected.filter(
          (item) => item !== e.target.value,
        );
      }
    }
    setMetadataValue(tempSelected);
    forceUpdate();
  }

  // then make the query in here

  return (
    <>
      <Typography variant="h6">{node.label}</Typography>
      <Typography variant="body1">{node.description}</Typography>
      <FormGroup>
        {options.map((item) => {
          if (item.other) {
            return (
              <FormControlLabel
                control={
                  <Checkbox name="metadata_other" value={metadataValue.other} />
                }
                label={
                  isEditing ? (
                    <TextField
                      value={otherText}
                      onChange={handleOtherTextChange}
                    />
                  ) : (
                    metadataValue.other
                  )
                }
                checked={metadataValue.other}
                disabled={!isEditing}
                onChange={handleChange}
              />
            );
          } else {
            return (
              <FormControlLabel
                control={<Checkbox name={item.label} value={item.label} />}
                label={item.label}
                checked={metadataValue.selected.indexOf(item.label) > -1}
                disabled={!isEditing}
                onChange={handleChange}
              />
            );
          }
        })}
      </FormGroup>
      {hasData && !isEditing ? (
        <>
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
          <br />
          <EditButton />
          <DeleteButton />
        </>
      ) : (
        <>
          <CancelButton />
          <SaveButton {...{ mutationPayload }} />
        </>
      )}
    </>
  );
}

MetadataMultiselect.propTypes = {
  node: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  hasData: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  metadataValue: PropTypes.string.isRequired,
  setMetadataValue: PropTypes.func.isRequired,
  EditButton: PropTypes.element.isRequired,
  DeleteButton: PropTypes.element.isRequired,
  CancelButton: PropTypes.element.isRequired,
  SaveButton: PropTypes.element.isRequired,
};

export default MetadataMultiselect;
