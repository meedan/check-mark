import React from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Radio,
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
  isSingle,
}) {
  let mutationPayload = {};

  if (node.type === 'multiple_choice') {
    mutationPayload = {
      response_multiple_choice: JSON.stringify(metadataValue),
    };
  } else if (node.type === 'single_choice') {
    mutationPayload = {
      response_single_choice: metadataValue,
    };
  }
  const options = node.options;
  const [otherText, setOtherText] = React.useState(
    isSingle ? getSavedOtherValue() : metadataValue.other,
  );
  const forceUpdate = React.useReducer(() => ({}))[1];

  function handleOtherTextChange(e) {
    setOtherText(e.target.value);
    if (isSingle) {
      setMetadataValue(e.target.value);
    } else {
      let tempSelected = metadataValue;
      tempSelected.other = e.target.value;
      setMetadataValue(tempSelected);
    }
  }

  function handleMultiChange(e) {
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

  function handleSingleChange(e) {
    let tempSelected = metadataValue;
    if (e.target.name === 'metadata_other') {
      //if it's the Other field a user is checking, we need ot
      tempSelected = otherText;
    } else {
      tempSelected = e.target.value;
    }
    setMetadataValue(tempSelected);
    forceUpdate();
  }

  function getSavedOtherValue() {
    // in single select we only know what the "other" value is if "other" is actively selected. so if "other" is not actively selected, we can only render the "other" label as a blank string.
    if (isSingle) {
      // of the non-"other" options, if every option does NOT match the current selected option, then "other" must be selected
      const isOtherOptionSelected = options
        .filter((option) => !option.other)
        .every((option) => option.label !== metadataValue);
      // grab an "other" option to see if it exists in the first place
      const otherOption = options.filter((option) => option.other);
      if (otherOption.length > 0 && isOtherOptionSelected) {
        return metadataValue;
      } else {
        // we can't tell what the "other" value is
        return '';
      }
    } else {
      return metadataValue.other || '';
    }
  }

  return (
    <>
      <Typography variant="h6">{node.label}</Typography>
      <Typography variant="body1">{node.description}</Typography>
      <FormGroup>
        {options.map((option) => {
          if (option.other) {
            return (
              <FormControlLabel
                control={
                  isSingle ? (
                    <Radio name="metadata_other" value={getSavedOtherValue()} />
                  ) : (
                    <Checkbox
                      name="metadata_other"
                      value={metadataValue.other}
                    />
                  )
                }
                label={
                  !hasData || isEditing ? (
                    <TextField
                      value={otherText}
                      onChange={handleOtherTextChange}
                    />
                  ) : (
                    getSavedOtherValue()
                  )
                }
                checked={
                  isSingle
                    ? otherText.length > 0 && metadataValue === otherText
                    : metadataValue.other
                }
                disabled={hasData && !isEditing}
                onChange={isSingle ? handleSingleChange : handleMultiChange}
              />
            );
          } else {
            return (
              <FormControlLabel
                control={
                  isSingle ? (
                    <Radio name={option.label} value={option.label} />
                  ) : (
                    <Checkbox name={option.label} value={option.label} />
                  )
                }
                label={option.label}
                checked={
                  isSingle
                    ? option.label === metadataValue
                    : metadataValue.selected.indexOf(option.label) > -1
                }
                disabled={hasData && !isEditing}
                onChange={isSingle ? handleSingleChange : handleMultiChange}
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
          <CancelButton {...{ setOtherText }} />
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
  isSingle: PropTypes.bool.isRequired,
};

export default MetadataMultiselect;
