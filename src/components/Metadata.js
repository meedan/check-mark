import React from 'react';
import {
  graphql,
  loadQuery,
  usePreloadedQuery,
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
import colors from './colors';
import config from './../config';

const tasksQuery = graphql`
  query MetadataQuery($ids: String!) {
    project_media(ids: $ids) {
      tasks(first: 10) {
        edges {
          node {
            fieldset
            label
            type
            show_in_browser_extension
            id
            first_response_value
            first_response {
              id
            }
            description
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
    }
  }
`;

const updateAnnotationMutation = graphql`
  mutation MetadataTaskMutation($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      clientMutationId
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
}));

const Metadata = (props) => {
  const classes = useStyles();
  const { projectMedia } = props;
  const environment = useRelayEnvironment();

  const ids = projectMedia.dbid.toString();
  const tasksQueryReference = loadQuery(environment, tasksQuery, { ids });

  function reloadQuery() {
    loadQuery(environment, tasksQuery, { ids });
  }

  function TextType(props) {
    const { item } = props;
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

    let output = null;

    function handleSave() {
      console.log('DOING IT');
      commit({
        variables: {
          input: {
            id: node?.id,
            response: `{"annotation_type":"task_response_free_text","set_fields":"{\\"response_free_text\\":\\"${textValue}\\"}"}`,
          },
        },
        onCompleted(data) {
          console.log('heyyyy', data);
          setIsEditing(false);
          reloadQuery();
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
      console.log('DELETING IT', node?.first_response?.id);
      commitDelete({
        variables: {
          input: {
            id: node?.first_response?.id,
          },
        },
        onCompleted(data) {
          console.log('heyyyy we deleted', data);
          setIsEditing(true);
          setTextValue('');
          reloadQuery();
        },
      });
    }

    function handleChange(e) {
      setTextValue(e.target.value);
    }

    if (hasData && !isEditing) {
      output = (
        <>
          <Typography variant="h6">{node?.label}</Typography>
          <Typography variant="body1">{node?.description}</Typography>
          <Typography variant="body1" className={classes.value}>
            {textValue}
          </Typography>
          <img src={node?.annotator?.user?.profile_image} alt="Profile image" />
          <Typography variant="body1">
            Completed by{' '}
            <a
              href={`https://${config.checkWebUrl}/check/user/${node?.annotator?.user?.dbid}`}
            >
              {node?.annotator?.user?.name}
            </a>
          </Typography>
          <Button onClick={handleEdit}>Edit</Button>
          <Button onClick={handleDelete}>Delete</Button>
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

  function RenderData() {
    // if the data exists, render the readable data. if it doesn't, render an input
    const data = usePreloadedQuery(tasksQuery, tasksQueryReference);
    console.log('data!', data);
    return (
      <div>
        {data.project_media?.tasks?.edges
          .filter((item) => item.node?.fieldset === 'metadata')
          .map((item) => (
            <>
              <TextType item={item} />
              <Divider />
            </>
          ))}
      </div>
    );
  }

  return (
    <Box id="metadata" className={classes.root}>
      <React.Suspense fallback={<p>loading</p>}>
        <RenderData />
      </React.Suspense>
    </Box>
  );
};

export default Metadata;
