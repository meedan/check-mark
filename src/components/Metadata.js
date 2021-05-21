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
import { Box, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import UpdateQuery from './__generated__/UpdateQuery.graphql';
import MetadataText from './metadata/MetadataText';
import MetadataNumber from './metadata/MetadataNumber';

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

function RenderData(props) {
  const { updateQueryRef } = props;
  const environment = useRelayEnvironment();
  const data = usePreloadedQuery(UpdateQuery, updateQueryRef);

  console.log('rerendering data!', data);

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
                  default:
                    output = <MetadataText {...props} />;
                }
                return output;
              }}
            />
            <Divider />
          </>
        );
      })}
    </div>
  );
}

function MetadataContainer(props) {
  const { render, item, itemInitQueryRef } = props;
  const classes = useStyles();
  const node = item.node;
  const [isEditing, setIsEditing] = React.useState(false);
  const hasData = !!item.node?.first_response_value;
  const [metadataValue, setMetadataValue] = React.useState(
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

  function handleSave(response) {
    commit({
      variables: {
        input: {
          id,
          response,
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
        metadataValue,
        setMetadataValue,
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
};

export default Metadata;
