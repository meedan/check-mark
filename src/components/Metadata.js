import React from 'react';
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
  Button,
  CircularProgress,
  InputAdornment,
  Typography,
  TextField,
  Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import config from './../config';
import UpdateQuery from './__generated__/UpdateQuery.graphql';

const getMetadataItemQuery = graphql`
  query MetadataTaskItemQuery($id: ID!) {
    node(id: $id) {
      ... on Task {
        fieldset
        label
        type
        show_in_browser_extension
        id
        description
        first_response_value
        first_response {
          id
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

const updateAnnotationMutation = graphql`
  mutation MetadataTaskMutation($input: UpdateTaskInput!) {
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

const deleteAnnotationMutation = graphql`
  mutation MetadataDeleteMutation($input: DestroyDynamicInput!) {
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

const Metadata = (props) => {
  const classes = useStyles();
  const { initialQueryRef } = props;
  const environment = useRelayEnvironment();

  const [updateQueryRef] = useQueryLoader(UpdateQuery, initialQueryRef);

  function MetadataContainer(props) {
    const { render, item, itemInitQueryRef } = props;
    const node = item.node;
    const [isEditing, setIsEditing] = React.useState(false);
    const hasData = !!item.node?.first_response_value;
    const [textValue, setTextValue] = React.useState(
      node?.first_response_value,
    );
    const [commit, isInFlight] = useMutation(updateAnnotationMutation);
    const [commitDelete, isDeleteInFlight] = useMutation(
      deleteAnnotationMutation,
    );
    const id = node?.id;

    const [, loadItemQuery] = useQueryLoader(
      getMetadataItemQuery,
      itemInitQueryRef,
    );

    function handleSave() {
      commit({
        variables: {
          input: {
            id,
            response: `{"annotation_type":"task_response_free_text","set_fields":"{\\"response_free_text\\":\\"${textValue}\\"}"}`,
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
      setTextValue(node?.first_response_value);
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
          setTextValue('');
          setIsEditing(true);
        },
      });
    }

    return (
      <>
        {render({
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
          textValue,
          setTextValue,
        })}
      </>
    );
  }

  // TODO: externalize this to a file, add proptypes (eslint will flag these now), probably either rename textValue and setTextValue to value and setValue OR internalize these on the *Type functions themselves
  function TextType(props) {
    const {
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
      textValue,
      setTextValue,
    } = props;

    function handleChange(e) {
      setTextValue(e.target.value);
    }

    let output = null;

    if (hasData && !isEditing) {
      output = (
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
      );
    } else {
      output = (
        <>
          <Typography variant="h6">{node?.label}</Typography>
          <Typography variant="body1">{node?.description}</Typography>
          <TextField
            label="Answer here"
            variant="outlined"
            value={textValue}
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
          <Button onClick={handleSave}>Save</Button>
        </>
      );
    }
    return output;
  }

  function RenderData(props) {
    const { updateQueryRef } = props;
    // if the data exists, render the readable data. if it doesn't, render an input
    const data = usePreloadedQuery(UpdateQuery, updateQueryRef);
    console.log('rerendering data!', data);
    // load a query for every individual type

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
          return (
            <>
              <MetadataContainer
                item={item}
                itemInitQueryRef={itemInitQueryRef}
                render={(props) => <TextType {...props} />}
              />
              <Divider />
            </>
          );
        })}
      </div>
    );
  }

  return (
    <Box id="metadata" className={classes.root}>
      <React.Suspense fallback={<p>loading</p>}>
        <RenderData {...{ updateQueryRef }} />
      </React.Suspense>
    </Box>
  );
};

export default Metadata;
