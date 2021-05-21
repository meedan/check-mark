import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  CircularProgress,
  InputAdornment,
  Typography,
  TextField,
} from '@material-ui/core';
import config from './../../config';

function MetadataNumber({
  node,
  classes,
  handleEdit,
  handleDelete,
  handleCancel,
  handleSave,
  isDeleteInFlight,
  isInFlight,
  hasData,
  isEditing,
  metadataValue,
  setMetadataValue,
}) {
  const mutationPayload = `{"annotation_type":"task_response_number","set_fields":"{\\"response_number\\":\\"${metadataValue}\\"}"}`;

  function handleChange(e) {
    setMetadataValue(e.target.value);
  }

  function isNumeric(value) {
    return !isNaN(+value) && isFinite(+value);
  }

  return (
    <>
      <p>NUMBER</p>
      {hasData && !isEditing ? (
        <>
          <Typography variant="h6">{node?.label}</Typography>
          <Typography variant="body1">{node?.description}</Typography>
          <Typography variant="body1" className={classes.value}>
            {node?.first_response_value}
          </Typography>
          <img
            className={classes.profileImage}
            src={node?.annotator?.user?.profile_image}
            alt="Profile image"
          />
          <Typography variant="body1">
            Completed by{' '}
            <a
              href={`https://${config.checkWebUrl}/check/user/${node?.annotator?.user?.dbid}`}
            >
              {node?.annotator?.user?.name}
            </a>
          </Typography>
          <Button onClick={handleEdit}>
            <FormattedMessage
              id="metadata.edit"
              defaultMessage="Edit"
              description="This is a label that appears on a button next to an item that the user can edit. The label indicates that if the user presses this button, the item will become editable."
            />
          </Button>
          <Button onClick={handleDelete}>
            <FormattedMessage
              id="metadata.delete"
              defaultMessage="Delete"
              description="This is a label that appears on a button next to an item that the user can delete. The label indicates that if the user presses this button, the item will be deleted."
            />
          </Button>
          {isDeleteInFlight ? <CircularProgress size={20} /> : null}
        </>
      ) : (
        <>
          <Typography variant="h6">{node?.label}</Typography>
          <Typography variant="body1">{node?.description}</Typography>
          <TextField
            label="Answer here"
            type="number"
            variant="outlined"
            value={metadataValue}
            onChange={handleChange}
            InputProps={{
              endAdornment: isInFlight ? (
                <InputAdornment position="end">
                  <CircularProgress />
                </InputAdornment>
              ) : null,
            }}
          />
          <br />
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            onClick={() => handleSave(mutationPayload)}
            disabled={!metadataValue || !isNumeric(metadataValue)}
          >
            Save
          </Button>
        </>
      )}
    </>
  );
}

MetadataNumber.propTypes = {
  node: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  isDeleteInFlight: PropTypes.bool.isRequired,
  isInFlight: PropTypes.bool.isRequired,
  hasData: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  metadataValue: PropTypes.string.isRequired,
  setMetadataValue: PropTypes.func.isRequired,
};

export default MetadataNumber;
