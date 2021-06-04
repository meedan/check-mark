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
  Box,
  CircularProgress,
  Divider,
  Button,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import UpdateQuery from './__generated__/UpdateQuery.graphql';
import MetadataText from './metadata/MetadataText';
import MetadataNumber from './metadata/MetadataNumber';
import MetadataMultiselect from './metadata/MetadataMultiselect';
import MetadataDate from './metadata/MetadataDate';
import MetadataFile from './metadata/MetadataFile';
import MetadataLocation from './metadata/MetadataLocation';
import config from './../../config';

const getMetadataItemQuery = graphql`
  query MetadataTaskItemQuery($id: ID!) {
    node(id: $id) {
      ... on Task {
        fieldset
        label
        type
        options
        show_in_browser_extension
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
  value: {
    fontWeight: 900,
  },
  profileImage: {
    maxWidth: 25,
    float: 'left',
  },
  dropZone: {
    padding: theme.spacing(2),
    border: '2px dashed',
    minHeight: '100px',
  },
  timeZoneSelect: {
    marginTop: theme.spacing(4),
  },
  map: {
    width: '100%',
    height: '500px',
  },
  mapImg: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
  annotator: {
    margin: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  metadata: {
    '& .MuiInputBase-root': {
      marginBottom: theme.spacing(2),
    },
  },
  fieldInfo: {
    marginBottom: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function RenderData(props) {
  const { updateQueryRef } = props;
  const classes = useStyles();
  const environment = useRelayEnvironment();
  const data = usePreloadedQuery(UpdateQuery, updateQueryRef);

  return (
    <div>
      {data.project_media?.tasks?.edges?.length === 0 ? (
        <span>No metadata fields</span>
      ) : (
        data.project_media?.tasks?.edges.map((item) => {
          // a query just for this one element
          const itemInitQueryRef = loadQuery(
            environment,
            getMetadataItemQuery,
            { id: item.node?.id },
            { fetchPolicy: 'network-only' },
          );
          const metadataType = item.node?.type;
          return (
            <>
              <MetadataContainer
                item={item}
                itemInitQueryRef={itemInitQueryRef}
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
                      output = <MetadataLocation {...props} />;
                      break;
                    case 'datetime':
                      output = <MetadataDate {...props} />;
                      break;
                    case 'file_upload':
                      output = (
                        <MetadataFile
                          {...props}
                          extensions={data.about.file_extensions}
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
  const { render, item, itemInitQueryRef, isDynamic } = props;
  const classes = useStyles();
  const node = item.node;
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
      },
    });
  }

  function EditButton() {
    return (
      <Button onClick={handleEdit} className="metadata-edit">
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
        <Button className="metadata-delete" onClick={handleDelete}>
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
              className="metadata-cancel"
              onClick={() => handleDynamicCancel(setOtherText)}
            >
              {cancelMessage}
            </Button>
          </>
        ) : (
          <>
            <Button className="metadata-cancel" onClick={handleCancel}>
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
              className="metadata-save"
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
              className="metadata-save"
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
        <Typography variant="subtitle2">{node.description}</Typography>
      </div>
    );
  }

  function AnnotatorInformation() {
    return (
      <div>
        <img
          className={classes.profileImage}
          src={node.annotator?.user?.profile_image.replace(
            'localhost',
            'cormorant',
          )}
          alt="Profile image"
        />
        <Typography className={classes.annotator} variant="body1">
          Completed by{' '}
          <a
            href={`https://${config.checkWebUrl}/check/user/${node.annotator?.user?.dbid}`}
          >
            {node.annotator?.user?.name}
          </a>
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
