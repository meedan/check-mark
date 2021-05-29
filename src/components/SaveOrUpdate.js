import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql, useRelayEnvironment } from 'react-relay';
import { FormattedMessage } from 'react-intl';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Loading from './Loading';
import Message from './Message';
import Save from './Save';
import Update from './Update';

const useStyles = makeStyles(theme => ({
  paragraph: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const SaveOrUpdate = ({ url, text, user, onLogout }) => {
  const classes = useStyles();
  const environment = useRelayEnvironment();
  const [projectMediaCreated, setProjectMediaCreated] = React.useState(null);

  const handleSave = (newProjectMediaCreated, project) => {
    setProjectMediaCreated({ projectMedia: newProjectMediaCreated, project });
  };

  if (projectMediaCreated) {
    let projectId = null;
    if (projectMediaCreated.project) {
      projectId = projectMediaCreated.project.dbid;
    }
    return (
      <Update projectMedia={projectMediaCreated.projectMedia} projectId={projectId} onLogout={onLogout} user={user} justSaved />
    );
  }

  if (text) {
    return (
      <Save text={text} user={user} onSave={handleSave} onLogout={onLogout} />
    );
  }

  if (url) {
    return (
      <Box id="saveorupdate">
        <QueryRenderer environment={environment}
          query={graphql`
            query SaveOrUpdateQuery($url: String!) {
              project_medias(url: $url) {
                edges {
                  node {
                    dbid
                    type
                    media {
                      metadata
                    }
                    metrics: annotation(annotation_type: "metrics") {
                      data
                    }
                    team {
                      slug
                      name
                    }
                    project_id
                    project {
                      title,
                      dbid,
                      id,
                    }
                  }
                }
              }
            }
          `}

          variables={{
            url,
          }}

          render={(response) => {
            const { error } = response;
            const data = response.props;
            if (!error && data && data.project_medias.edges.length > 0) {
              let team = null;
              if (user && user.current_team) {
                team = user.current_team;
              }
              let projectMedia = null;
              data.project_medias.edges.forEach((projectMediaEdge) => {
                if (team && team.slug === projectMediaEdge.node.team.slug) {
                  if (!projectMedia) {
                    projectMedia = projectMediaEdge.node;
                  }
                }
              });
              let projectId = null;
              if (projectMedia && projectMedia.project_id) {
                projectId = projectMedia.project_id;
              }
              return (
                <Update projectMedia={projectMedia} projectId={projectId} user={user} onLogout={onLogout} />
              );
            } else if (!error && data && data.project_medias.edges.length === 0) {
              return (
                <Save url={url} user={user} onSave={handleSave} onLogout={onLogout} />
              );
            } else if (error) {
              return (
                <Message>
                  <FormattedMessage id="saveOrUpdate.error" defaultMessage="Sorry, could not look for this URL in Check." />
                </Message>
              );
            }
            return (
              <Loading message={<FormattedMessage id="saveOrUpdate.loading" defaultMessage="Looking for this URL in Check…" />} />
            );
          }}
        />
      </Box>
    );
  }

  return (
    <Message>
      <Typography variant="body1" className={classes.paragraph}>
        <FormattedMessage id="saveOrUpdate.errorNoUrlOrText" defaultMessage="You need to enter at least a URL or a piece of text." />
      </Typography>
    </Message>
  );
};

SaveOrUpdate.propTypes = {
  user: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default SaveOrUpdate;
