import React from 'react';
import PropTypes from 'prop-types';
import { Typography, TextField, Box } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import config from './../../config';

function MetadataFile({
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
  extensions,
}) {
  const [error, setError] = React.useState({ message: null });
  const [file, setFile] = React.useState({});
  extensions = {
    label: extensions,
    list: extensions.split(', '),
  };

  // 1.0 MB max file size
  const maxFileSize = { bytes: 1048576, label: '1.0 MB' };

  const errorTooManyFiles = (
    <FormattedMessage
      id="metadata.file.tooManyFiles"
      defaultMessage="You can only upload one file here. Please try uploading one file."
      description="This message appears when a user tries to add two or more files at once to the file upload widget."
    />
  );

  const errorInvalidFile = (
    <FormattedMessage
      id="metadata.file.invalidFile"
      defaultMessage="This is not a valid file. Please try again with a different file."
      description="This message appears when a user tries to add two or more files at once to the file upload widget."
    />
  );

  const errorFileTooBig = (
    <FormattedMessage
      id="metadata.file.tooBig"
      defaultMessage="This file is too big. The maximum allowed file size is {fileSizeLabel}. Please try again with a different file."
      description="This message appears when a user tries to upload a file that is too big. The 'fileSizeLabel' will read something like '1.0 MB' and will not be localized."
      values={{
        fileSizeLabel: maxFileSize.label,
      }}
    />
  );

  const errorFileType = (
    <FormattedMessage
      id="metadata.file.wrongType"
      defaultMessage="This is not an accepted file type. Accepted file types include: {extensions}. Please try again with a different file."
      description="This message appears when a user tries to upload a file that is the wrong file type. The 'extensions' variable will be a list of file extensions (PDF, PNG, etc) and will not be localized."
      values={{
        extensions: extensions.label,
      }}
    />
  );

  const mutationPayload = {
    annotation_type: 'task_response_free_text',
    set_fields: `{"response_free_text":"${metadataValue}"}`,
  };

  function handleDrop(e) {
    e.preventDefault();
    if (e.dataTransfer.items.length > 1) {
      setError({ message: errorTooManyFiles });
    } else {
      if (e.dataTransfer.items[0].kind === 'file') {
        const fileData = e.dataTransfer.items[0].getAsFile();
        console.log(fileData);
        const fileExtensionMatch = fileData.name?.match(/\.(\w*)$/);
        const fileExtension =
          fileExtensionMatch?.length > 1 ? fileExtensionMatch[1] : '';
        if (extensions.list.includes(fileExtension)) {
          if (fileData.size < maxFileSize.bytes) {
            // TODO: upload file
            setError({ message: null });
            setFile(fileData);
          } else {
            setError({ message: errorFileTooBig });
          }
        } else {
          setError({ message: errorFileType });
        }
      } else {
        setError({ message: errorInvalidFile });
      }
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDragEnter(e) {}

  function handleDragLeave(e) {}

  function RenderDrop() {
    return file.name ? (
      <Typography variant="body1">
        <p>{file.name}</p>
      </Typography>
    ) : (
      <Typography variant="body1">
        <FormattedMessage
          id="metadata.file.dropFile"
          defaultMessage="Drag and drop a file here, or click to upload a file (max size: {fileSizeLabel}, allowed extensions: {extensions})"
          description="This message appears in a rectangle, instructing the user that they can use their mouse to drag and drop a file, or click to pull up a file selector menu. This also tells them the maximum allowed file size, and the valid types of files that the user can upload. The `fileSizeLabel` variable will read something like '1.0 MB', and the 'extensions' variable is a list of valid file extensions. Neither will be localized."
          values={{
            extensions: extensions.label,
            fileSizeLabel: maxFileSize.label,
          }}
        />
      </Typography>
    );
  }

  console.log('file node', node, metadataValue);

  return (
    <>
      {hasData && !isEditing ? (
        <>
          <Typography variant="h6">{node.label}</Typography>
          <Typography variant="body1">{node.description}</Typography>
          <Typography variant="body1" className={classes.value}>
            <a href={node.first_response?.file_data[0]}>
              {node.first_response_value}
            </a>
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
          <Box
            className={classes.dropZone}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
          >
            {error.message ? (
              <Typography variant="body1">{error.message}</Typography>
            ) : (
              <RenderDrop />
            )}
          </Box>
          <br />
          <CancelButton />
          <SaveButton {...{ mutationPayload }} disabled={error.message !== null} />
        </>
      )}
    </>
  );
}

MetadataFile.propTypes = {
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
  extensions: PropTypes.string.isRequired,
};

export default MetadataFile;
