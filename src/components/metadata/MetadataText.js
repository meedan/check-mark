import React from 'react';
import PropTypes from 'prop-types';
import { Typography, TextField } from '@material-ui/core';
import config from './../../config';

function MetadataText({
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
  const mutationPayload = {
    annotation_type: 'task_response_free_text',
    set_fields: `{"response_free_text":"${metadataValue}"}`,
  };

  function handleChange(e) {
    setMetadataValue(e.target.value);
  }

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
  hasData: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  metadataValue: PropTypes.string.isRequired,
  setMetadataValue: PropTypes.func.isRequired,
};

export default MetadataText;
