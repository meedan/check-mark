import React from 'react';
import PropTypes from 'prop-types';
import { Typography, TextField } from '@material-ui/core';

function MetadataText({
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
  const mutationPayload = {
    annotation_type: 'task_response_free_text',
    set_fields: `{"response_free_text":"${metadataValue}"}`,
  };

  function handleChange(e) {
    setMetadataValue(e.target.value);
  }

  return (
    <>
      <FieldInformation/>
      {hasData && !isEditing ? (
        <>
          <Typography variant="body1" className={classes.value}>
            {node.first_response_value}
          </Typography>
          <AnnotatorInformation />
          <EditButton />
          <DeleteButton />
        </>
      ) : (
        <>
          <TextField
            id="metadata-input"
            label="Answer here"
            variant="outlined"
            value={metadataValue}
            onChange={handleChange}
          />
          <br />
          <CancelButton />
          <SaveButton {...{ mutationPayload }} />
        </>
      )}
    </>
  );
}

MetadataText.propTypes = {
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

export default MetadataText;
