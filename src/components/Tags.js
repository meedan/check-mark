import React from 'react';
import {
  graphql,
  useRelayEnvironment,
  QueryRenderer,
} from 'react-relay';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import TagMenu from './TagMenu';

const Tags = ({ projectMedia }) => (
  <Box mb={1} display="flex" alignItems="center">
    <TagMenu projectMedia={projectMedia} />
    { projectMedia.tags?.edges.map(t => (
      <Box m={0.5}>
        <Chip label={t.node.tag_text} />
      </Box>
    ))}
  </Box>
);

const TagsContainer = ({ projectMedia }) => {
  const environment = useRelayEnvironment();

  return (
    <QueryRenderer environment={environment}
      query={graphql`
        query TagsContainerQuery($id: String!) {
          project_media(ids: $id) {
            dbid
            tags {
              edges {
                node {
                  id
                  tag_text
                }
              }
            }
            team {
              tag_texts {
                edges {
                  node {
                    text
                  }
                }
              }
            }
          }
        }
      `}

      variables={{
        id: projectMedia.dbid.toString(),
      }}

      render={({ error, props }) => {
        if (!error && props) {
          return (<Tags projectMedia={props.project_media} />);
        }

        return null;
      }}
    />
  );
};

export default TagsContainer;
