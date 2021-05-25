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
import { Box, CircularProgress, Divider, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import UpdateQuery from './__generated__/UpdateQuery.graphql';
import MetadataText from './metadata/MetadataText';
import MetadataNumber from './metadata/MetadataNumber';
import MetadataMultiselect from './metadata/MetadataMultiselect';

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
  },
}));

function RenderData(props) {
  const { updateQueryRef } = props;
  const environment = useRelayEnvironment();
  const data = usePreloadedQuery(UpdateQuery, updateQueryRef);

  return (
    <div>
      {data.project_media?.tasks?.edges.map((item) => {
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
                  default:
                    output = <MetadataText {...props} />;
                }
                return output;
              }}
              isDynamic={metadataType === 'multiple_choice'}
            />
            <Divider />
          </>
        );
      })}
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
  if (isDynamic) {
    try {
      initialDynamic = JSON.parse(
        JSON.parse(node?.first_response?.content)[0].value,
      );
    } catch (exception) {
      initialDynamic = {};
    }
  }
  const [metadataValue, setMetadataValue] = React.useState(
    isDynamic ? initialDynamic : node?.first_response_value,
  );
  const [commit, isInFlight] = useMutation(updateTaskMutation);
  const [dynamicCommit, isDynamicInFlight] = useMutation(updateDynamicMutation);
  const [commitDelete, isDeleteInFlight] = useMutation(deleteDynamicMutation);
  const id = isDynamic ? node?.first_response?.id : node?.id;

  const [, loadItemQuery] = useQueryLoader(
    getMetadataItemQuery,
    itemInitQueryRef,
  );

  function handleSave(response) {
    commit({
      variables: {
        input: {
          id,
          response: JSON.stringify(response),
        },
      },
      onCompleted() {
        loadItemQuery({ id }, { fetchPolicy: 'network-only' });
        setIsEditing(false);
      },
    });
  }

  function handleDynamicSave(response) {
    dynamicCommit({
      variables: {
        input: {
          id,
          set_fields: JSON.stringify(response),
        },
      },
      onCompleted() {
        loadItemQuery({ id }, { fetchPolicy: 'network-only' });
        setIsEditing(false);
      },
    });
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
    setMetadataValue(node?.first_response_value);
  }

  function handleDynamicCancel() {
    let initialDynamic;
    try {
      initialDynamic = JSON.parse(
        JSON.parse(node?.first_response?.content)[0].value,
      );
    } catch (exception) {
      initialDynamic = {};
    }
    setIsEditing(false);
    setMetadataValue(initialDynamic);
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
      <Button onClick={handleEdit}>
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
        <Button onClick={handleDelete}>
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

  function CancelButton() {
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
            <Button onClick={handleDynamicCancel}>{cancelMessage}</Button>
          </>
        ) : (
          <>
            <Button onClick={handleCancel}>{cancelMessage}</Button>
          </>
        )}
      </>
    );
  }

  function SaveButton(props) {
    const { mutationPayload, disabled } = props;
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
              onClick={() => handleDynamicSave(mutationPayload)}
              disabled={disabled}
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
  };

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
