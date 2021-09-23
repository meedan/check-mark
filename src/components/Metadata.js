import React from 'react';
import PropTypes from 'prop-types';
import {
  graphql,
  loadQuery,
  usePreloadedQuery,
  useQueryLoader,
  useRelayEnvironment,
  useMutation,
} from 'react-relay';
import { FormattedMessage } from 'react-intl';
import {
  MetadataText,
  MetadataNumber,
  MetadataMultiselect,
  MetadataDate,
  MetadataFile,
  MetadataLocation,
} from '@meedan/check-ui';
import {
  Box,
  CircularProgress,
  Divider,
  Button,
  Link,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import DayJsUtils from '@date-io/dayjs';
import Linkify from 'react-linkify';
import Tags from './Tags';
import UpdateQuery from './__generated__/UpdateQuery.graphql';
import config from './../../config';

dayjs.extend(relativeTime);

const getMetadataItemQuery = graphql`
  query MetadataTaskItemQuery($id: ID!) {
    node(id: $id) {
      ... on Task {
        fieldset
        label
        type
        options
        show_in_browser_extension
        team_task_id,
        team_task {
          conditional_info
          options
        },
        id
        description
        first_response_value
        first_response {
          id
          content
          file_data
        }
        annotator {
          id
          user {
            id
            dbid
            name
            profile_image
          }
        }
      }
    }
  }
`;

const updateTaskMutation = graphql`
  mutation MetadataUpdateTaskMutation($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      taskEdge {
        node {
          id
          first_response_value
        }
      }
    }
  }
`;

const updateDynamicMutation = graphql`
  mutation MetadataDynamicMutation($input: UpdateDynamicInput!) {
    updateDynamic(input: $input) {
      dynamicEdge {
        node {
          id
          content
        }
      }
    }
  }
`;

const deleteDynamicMutation = graphql`
  mutation MetadataDeleteDynamicMutation($input: DestroyDynamicInput!) {
    destroyDynamic(input: $input) {
      clientMutationId
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  profileImage: {
    maxWidth: 25,
    float: 'left',
  },
  annotator: {
    fontSize: '9px',
    color: '#979797',
  },
  metadata: {},
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  button: {
    backgroundColor: '#f4f4f4',
    marginTop: theme.spacing(1),
    '&:hover': {
      backgroundColor: '#ddd',
    },
  },
  '@global': {
    '.Mui-checked + .Mui-disabled': {
      color: 'inherit',
    },
  },
}));

function RenderData(props) {
  const { updateQueryRef } = props;
  const classes = useStyles();
  const environment = useRelayEnvironment();
  const data = usePreloadedQuery(UpdateQuery, updateQueryRef);
  const [rerender, setRerender] = React.useState(false);

  function generateMessages(about) {
    return {
      MetadataLocation: {
        customize: (
          <FormattedMessage
            id="metadata.location.customize"
            defaultMessage="Customize place name"
            description="This is a label that appears on a text field, related to a pin on a map. The user may type any text of their choice here and name the place they are pinning. They can also modify suggested place names here."
          />
        ),
        coordinates: (
          <FormattedMessage
            id="metadata.location.coordinates"
            defaultMessage="Latitude, longitude"
            description="This is a label that appears on a text field, related to a pin on a map. This contains the latitude and longitude coordinates of the map pin. If the user changes these numbers, the map pin moves. If the user moves the map pin, the numbers update to reflect the new pin location."
          />
        ),
        coordinatesHelper: (
          <FormattedMessage
            id="metadata.location.coordinates.helper"
            defaultMessage={`Should be a comma-separated pair of latitude and longitude coordinates like "-12.9, -38.15". Drag the map pin if you are having difficulty.`}
            description="This is a helper message that appears when someone enters text in the 'Latitude, longitude' text field that cannot be parsed as a valid pair of latitude and longitude coordinates. It tells the user that they need to provide valid coordinates and gives an example. It also tells them that they can do a drag action with the mouse on the visual map pin as an alternative to entering numbers in this field."
          />
        ),
        search: (
          <FormattedMessage
            id="metadata.location.search"
            defaultMessage="Search the map"
            description="This is a label that appears on a text field. If the user begins to type a location they will receive a list of suggested place names."
          />
        ),
      },
      MetadataFile: {
        dropFile: (
          <FormattedMessage
            id="metadata.file.dropFile"
            defaultMessage="Drag and drop a file here, or click to upload a file (max size: {fileSizeLabel}, allowed extensions: {extensions})"
            description="This message appears in a rectangle, instructing the user that they can use their mouse to drag and drop a file, or click to pull up a file selector menu. This also tells them the maximum allowed file size, and the valid types of files that the user can upload. The `fileSizeLabel` variable will read something like '1.0 MB', and the 'extensions' variable is a list of valid file extensions. Neither will be localized."
            values={{
              fileSizeLabel: about.file_max_size,
              extensions: about.file_extensions.join(', '),
            }}
          />
        ),
        errorTooManyFiles: (
          <FormattedMessage
            id="metadata.file.tooManyFiles"
            defaultMessage="You can only upload one file here. Please try uploading one file."
            description="This message appears when a user tries to add two or more files at once to the file upload widget."
          />
        ),

        errorInvalidFile: (
          <FormattedMessage
            id="metadata.file.invalidFile"
            defaultMessage="This is not a valid file. Please try again with a different file."
            description="This message appears when a user tries to add a file that the browser cannot read for some reason to the file upload widget."
          />
        ),

        errorFileTooBig: (
          <FormattedMessage
            id="metadata.file.tooBig"
            defaultMessage="This file is too big. The maximum allowed file size is {fileSizeLabel}. Please try again with a different file."
            description="This message appears when a user tries to upload a file that is too big. The 'fileSizeLabel' will read something like '1.0 MB' and will not be localized."
            values={{
              fileSizeLabel: about.file_max_size,
            }}
          />
        ),

        errorFileType: (
          <FormattedMessage
            id="metadata.file.wrongType"
            defaultMessage="This is not an accepted file type. Accepted file types include: {extensions}. Please try again with a different file."
            description="This message appears when a user tries to upload a file that is the wrong file type. The 'extensions' variable will be a list of file extensions (PDF, PNG, etc) and will not be localized."
            values={{
              extensions: about.file_extensions.join(', '),
            }}
          />
        ),
      },
    };
  }

  // Intersection of sets function
  // https://stackoverflow.com/a/37041756/4869657
  function intersect(a, b) {
    const setB = new Set(b);
    return [...new Set(a)].filter(x => setB.has(x));
  }

  // This function determines if we should show a metadata item based on conditional prerequisites
  function showMetadataItem(task) {
    const { conditional_info } = task.node.team_task;
    if (conditional_info) {
      try {
        const parsedConditionalInfo = JSON.parse(conditional_info);
        const { selectedFieldId, selectedConditional } = parsedConditionalInfo;
        let { selectedCondition } = parsedConditionalInfo;
        const matchingTask = data.project_media?.tasks?.edges.find(item => item.node.team_task_id === selectedFieldId);

        // check if there is an "Other" value by looking for the .other prop on options
        const hasOther = matchingTask.node.team_task?.options?.some(item => item.other);
        if (hasOther) {
          // if there is an "Other" value, then extract it by convering our first_response_value to an array and filtering out known values
          const otherValue = matchingTask.node.first_response_value?.split(', ').filter(item => !matchingTask.node.team_task?.options?.some(option => option.label === item))[0];
          // replace "Other" in selectedCondition with that value
          selectedCondition = selectedCondition.replace(/\bOther\b/, otherValue);
        }

        // render nothing if there is no response (the matching metadata item is not filled in)
        if (matchingTask.node.first_response_value === null || matchingTask.node.first_response_value === '') {
          return false;
        }

        if (selectedConditional === 'is...' && matchingTask.node.first_response_value === selectedCondition) {
          return true;
        } else if (selectedConditional === 'is not...' && matchingTask.node.first_response_value !== selectedCondition) {
          return true;
        } else if (selectedConditional === 'is empty...' && matchingTask.node.first_response_value === null) {
          return true;
        } else if (selectedConditional === 'is not empty...' && matchingTask.node.first_response_value !== null) {
          return true;
        } else if (selectedConditional === 'is any of...' && intersect(selectedCondition.split(', '), matchingTask.node.first_response_value?.split(', ')).length > 0) {
          // if the intersection of the options set and the selected set is not empty, then at least one item is in common
          return true;
        } else if (selectedConditional === 'is none of...' && intersect(selectedCondition.split(', '), matchingTask.node.first_response_value?.split(', ')).length === 0) {
          // if the intersection of the options set and the selected set is empty, then we have met the "none of" condition
          return true;
        }
        return false;
      } catch (e) {
        throw (e);
      }
    }
    return true;
  }

  return (
    <div>
      <Tags projectMedia={data.project_media} />
      {data.project_media?.tasks?.edges?.length === 0 ? (
        <span>No metadata fields</span>
      ) : (
        data.project_media?.tasks?.edges
          .filter(item => item.node?.show_in_browser_extension)
          .filter(showMetadataItem)
          .map((item) => {
            // a query just for this one element
            const itemInitQueryRef = loadQuery(
              environment,
              getMetadataItemQuery,
              { id: item.node?.id },
              { fetchPolicy: 'network-only' },
            );
            const metadataType = item.node?.type;
            const messages = generateMessages(data.about);
            return (
              <>
                <MetadataContainer
                  item={item}
                  itemInitQueryRef={itemInitQueryRef}
                  rerenderParent={{rerender, setRerender}}
                  render={(props) => {
                    let output = null;
                    switch (metadataType) {
                      case 'free_text':
                        output = <MetadataText {...props} />;
                        break;
                      case 'number':
                        output = <MetadataNumber {...props} />;
                        break;
                      case 'multiple_choice':
                        output = <MetadataMultiselect {...props} />;
                        break;
                      case 'single_choice':
                        output = <MetadataMultiselect {...props} isSingle />;
                        break;
                      case 'geolocation':
                        output = (
                          <MetadataLocation
                            {...props}
                            mapboxApiKey={config.mapboxApiKey}
                            messages={messages.MetadataLocation}
                          />
                        );
                        break;
                      case 'datetime':
                        output = <MetadataDate {...props} />;
                        break;
                      case 'file_upload':
                        output = (
                          <MetadataFile
                            {...props}
                            extensions={data.about.file_extensions}
                            fileSizeMax={data.about.file_max_size_in_bytes}
                            messages={messages.MetadataFile}
                          />
                        );
                        break;
                      default:
                        output = <MetadataText {...props} />;
                    }
                    return <div className={classes.metadata}>{output}</div>;
                  }}
                  isDynamic={
                    metadataType === 'multiple_choice' ||
                    metadataType === 'single_choice' ||
                    metadataType === 'file_upload'
                  }
                />
                <Divider className={classes.divider} />
              </>
            );
          })
      )}
    </div>
  );
}

function MetadataContainer(props) {
  const { render, rerenderParent, item, itemInitQueryRef, isDynamic } = props;
  const classes = useStyles();
  const node = item.node;
  const { setRerender } = rerenderParent;
  const [isEditing, setIsEditing] = React.useState(false);
  const hasData = !!item.node?.first_response_value;
  let initialDynamic = {};
  let initialValue = {};
  if (isDynamic) {
    try {
      if (node.type === 'multiple_choice') {
        initialDynamic = JSON.parse(
          JSON.parse(node?.first_response?.content)[0].value,
        );
      } else if (node.type === 'single_choice') {
        initialDynamic = JSON.parse(node?.first_response?.content)[0].value;
      }
    } catch (exception) {
      if (node.type === 'multiple_choice') {
        initialDynamic = { selected: [] };
      } else if (node.type === 'single_choice') {
        initialDynamic = '';
      }
    }
  } else {
    if (node.type === 'datetime') {
      initialValue = node?.first_response_value?.replace(' at ', ' ');
    } else {
      initialValue = node?.first_response_value;
    }
  }
  const [metadataValue, setMetadataValue] = React.useState(
    isDynamic ? initialDynamic : initialValue,
  );
  const [commit, isInFlight] = useMutation(updateTaskMutation);
  const [dynamicCommit, isDynamicInFlight] = useMutation(updateDynamicMutation);
  const [commitDelete, isDeleteInFlight] = useMutation(deleteDynamicMutation);
  const id = isDynamic ? node?.first_response?.id || node?.id : node?.id;

  const [, loadItemQuery] = useQueryLoader(
    getMetadataItemQuery,
    itemInitQueryRef,
  );

  function handleSave(payload) {
    commit({
      variables: {
        input: {
          id,
          response: JSON.stringify(payload),
        },
      },
      onCompleted() {
        loadItemQuery({ id }, { fetchPolicy: 'network-only' });
        setIsEditing(false);
        setRerender(!rerenderParent.rerender);
      },
    });
  }

  function handleDynamicSave(payload, uploadables) {
    // if this is a first-time creation (node.first_response is null) then we use the normal, non-dynamic save
    if (node.first_response === null) {
      const newPayload = {
        annotation_type: `task_response_${node.type}`,
        set_fields: JSON.stringify(payload),
      };

      handleSave(newPayload);
    } else {
      dynamicCommit({
        variables: {
          input: {
            id,
            set_fields: JSON.stringify(payload),
          },
        },
        onCompleted() {
          loadItemQuery({ id }, { fetchPolicy: 'network-only' });
          setIsEditing(false);
          setRerender(!rerenderParent.rerender);
        },
        uploadables,
      });
    }
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
    setMetadataValue(node?.first_response_value || '');
  }

  function handleDynamicCancel(setOtherText) {
    let initialDynamic;
    try {
      if (node.type === 'multiple_choice') {
        initialDynamic = JSON.parse(
          JSON.parse(node?.first_response?.content)[0].value,
        );
      } else if (node.type === 'single_choice') {
        initialDynamic = JSON.parse(node?.first_response?.content)[0].value;
      }
    } catch (exception) {
      if (node.type === 'multiple_choice') {
        initialDynamic = { selected: [] };
      } else if (node.type === 'single_choice') {
        initialDynamic = '';
      }
    }
    setIsEditing(false);
    setMetadataValue(initialDynamic);
    if (setOtherText) {
      setOtherText(initialDynamic);
    }
  }

  function handleDelete() {
    commitDelete({
      variables: {
        input: {
          id: node?.first_response?.id,
        },
      },
      onCompleted() {
        loadItemQuery({ id }, { fetchPolicy: 'network-only' });
        setMetadataValue('');
        setIsEditing(true);
        setRerender(!rerenderParent.rerender);
      },
    });
  }

  function EditButton() {
    return (
      <Button
        className={`${classes.button} metadata-edit`}
        onClick={handleEdit}
      >
        <FormattedMessage
          id="metadata.edit"
          defaultMessage="Edit"
          description="This is a label that appears on a button next to an item that the user can edit. The label indicates that if the user presses this button, the item will become editable."
        />
      </Button>
    );
  }

  function DeleteButton() {
    return (
      <>
        <Button
          className={`${classes.button} metadata-delete`}
          onClick={handleDelete}
        >
          <FormattedMessage
            id="metadata.delete"
            defaultMessage="Delete"
            description="This is a label that appears on a button next to an item that the user can delete. The label indicates that if the user presses this button, the item will be deleted."
          />
        </Button>
        {isDeleteInFlight ? <CircularProgress size={20} /> : null}
      </>
    );
  }

  function CancelButton(props) {
    const { setOtherText } = props;
    const cancelMessage = (
      <FormattedMessage
        id="metadata.cancel"
        defaultMessage="Cancel"
        description="This is a label that appears on a button next to an item that the user is editing. The label indicates that if the user presses this button, the user will 'cancel' the editing action and all changes will revert."
      />
    );
    return (
      <>
        {isDynamic ? (
          <>
            <Button
              className={`${classes.button} metadata-cancel`}
              onClick={() => handleDynamicCancel(setOtherText)}
            >
              {cancelMessage}
            </Button>
          </>
        ) : (
          <>
            <Button
              className={`${classes.button} metadata-cancel`}
              onClick={handleCancel}
            >
              {cancelMessage}
            </Button>
          </>
        )}
      </>
    );
  }

  CancelButton.propTypes = {
    setOtherText: PropTypes.func.isRequired,
  };

  function SaveButton(props) {
    const { mutationPayload, disabled, uploadables } = props;
    const saveMessage = (
      <FormattedMessage
        id="metadata.save"
        defaultMessage="Save"
        description="This is a label that appears on a button next to an item that the user is editing. The label indicates that if the user presses this button, the user will save the changes they have been making."
      />
    );
    return (
      <>
        {isDynamic ? (
          <>
            <Button
              onClick={() => handleDynamicSave(mutationPayload, uploadables)}
              disabled={disabled}
              className={`${classes.button} metadata-save`}
            >
              {saveMessage}
            </Button>
            {isDynamicInFlight ? <CircularProgress size={20} /> : null}
          </>
        ) : (
          <>
            <Button
              onClick={() => handleSave(mutationPayload)}
              disabled={disabled}
              className={`${classes.button} metadata-save`}
            >
              {saveMessage}
            </Button>
            {isInFlight ? <CircularProgress size={20} /> : null}
          </>
        )}
      </>
    );
  }

  SaveButton.propTypes = {
    mutationPayload: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    uploadables: PropTypes.object,
  };

  function FieldInformation() {
    return (
      <div className={classes.fieldInfo}>
        <Typography variant="h6">{node.label}</Typography>
        <Typography variant="subtitle2">
          <Linkify properties={{ onClick: function onClick(e) { const url = e.target.getAttribute('href'); e.target.setAttribute('href', '#'); window.open(url); }}}>{node.description}</Linkify>
        </Typography>
      </div>
    );
  }

  let updated_at;
  try {
    updated_at = JSON.parse(node.first_response?.content)[0]?.updated_at;
  } catch (exception) {
    updated_at = null;
  }

  const timeAgo = dayjs().to(dayjs(updated_at));

  function AnnotatorInformation() {
    return (
      <div>
        <Typography className={classes.annotator} variant="body1">
          Saved {timeAgo} by{' '}
          <Link
            href={`https://${config.checkWebUrl}/check/user/${node.annotator?.user?.dbid}`}
            color="primary"
          >
            {node.annotator?.user?.name}
          </Link>
        </Typography>
      </div>
    );
  }

  return (
    <>
      {render({
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
        AnnotatorInformation,
        FieldInformation,
      })}
    </>
  );
}

const Metadata = (props) => {
  const classes = useStyles();
  const { initialQueryRef } = props;
  const [updateQueryRef] = useQueryLoader(UpdateQuery, initialQueryRef);

  return (
    <Box id="metadata" className={classes.root}>
      <React.Suspense fallback={<p>loading</p>}>
        <RenderData {...{ updateQueryRef }} />
      </React.Suspense>
    </Box>
  );
};

Metadata.propTypes = {
  initialQueryRef: PropTypes.object.isRequired,
};

RenderData.propTypes = {
  updateQueryRef: PropTypes.object.isRequired,
};

MetadataContainer.propTypes = {
  render: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  itemInitQueryRef: PropTypes.object.isRequired,
  isDynamic: PropTypes.bool,
};

export default Metadata;
