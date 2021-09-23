import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import { loadQuery, useRelayEnvironment } from 'react-relay';
import Title from './Title';
import Menu from './Menu';
import Media from './Media';
import Metadata from './Metadata';
import colors from './colors';
import config from './../config';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  header: {
    padding: theme.spacing(2),
    background: colors.lightGray,
  },
  heading: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontWeight: 'bold',
  },
  spaced: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  select: {
    background: 'white',
    borderWidth: 2,
    outline: 0,
  },
  link: {
    textDecoration: 'underline',
    color: colors.blue,
    cursor: 'pointer',
  },
  frameContainer: {
    width: '100%',
    boxSizing: 'border-box',
    overflowY: 'auto',
    height: 'calc(100vh - 250px)',
    padding: theme.spacing(2),
    paddingTop: 0,
    position: 'relative',
  },
  frame: {
    border: 0,
    width: '100%',
    boxSizing: 'border-box',
    overflowY: 'hidden',
    position: 'absolute',
    left: 0,
  },
}));

const Update = ({
  projectMedia,
  projectId,
  onLogout,
  justSaved,
  user,
}) => {
  const classes = useStyles();
  const environment = useRelayEnvironment();

  const defaultTab = projectMedia.type === 'Link' ? 'media' : 'metadata';
  const [tab, setTab] = React.useState(defaultTab);
  const [frameHeight, setFrameHeight] = React.useState(0);

  const baseUrl = projectId
    ? `${config.checkWebUrl}/${projectMedia.team.slug}/project/${projectId}/media/${projectMedia.dbid}`
    : `${config.checkWebUrl}/${projectMedia.team.slug}/media/${projectMedia.dbid}`;

  const handleOpen = () => {
    window.open(baseUrl);
  };

  const handleChangeTab = (event, newTab) => {
    setFrameHeight(0);
    setTab(newTab);
  };

  React.useEffect(() => {
    const receiveMessage = (event) => {
      const data = JSON.parse(event.data);

      if (event.origin === config.checkWebUrl) {
        const data = JSON.parse(event.data);
        if (data.height) {
          let { height } = data;
          if (height > 0 && height < 400) {
            height = 400;
          }
          setFrameHeight(height);
        } else if (data.task || data.task === 0) {
          window.parent.postMessage(JSON.stringify({ task: data.task }), '*');
        }
      }

      if (data.selectedText) {
        document
          .getElementById('check-web-frame')
          .contentWindow.postMessage(event.data, config.checkWebUrl);
      }
    };
    window.addEventListener('message', receiveMessage, false);
  }, []);

  const updateQuery = graphql`
    query UpdateQuery($ids: String!) {
      project_media(ids: $ids) {
        id
        dbid
        tasks(fieldset: "metadata") {
          edges {
            node {
              fieldset
              label
              type
              show_in_browser_extension
              team_task_id,
              team_task {
                conditional_info
                options
              },
              id
              options
              first_response_value
              first_response {
                id
                content
                file_data
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
      about {
        file_extensions
        file_max_size
        file_max_size_in_bytes
      }
    }
  `;

  const ids = projectMedia.dbid.toString();
  const initialQueryRef = loadQuery(
    environment,
    updateQuery,
    { ids },
    { fetchPolicy: 'store-and-network' },
  );

  return (
    <Box id="update">
      <Box className={classes.header}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Title />
          <Menu onLogout={onLogout} />
        </Box>
        <Typography variant="body1" className={classes.heading}>
          {projectMedia.team.name}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {justSaved ? (
            <Typography variant="body1" className={classes.spaced}>
              <FormattedMessage id="update.saved" defaultMessage="Saved!" />
            </Typography>
          ) : (
            <Typography variant="body1" className={classes.spaced}>
              <FormattedMessage
                id="update.alreadyAdded"
                defaultMessage="This link has already been added."
              />
            </Typography>
          )}
          <Typography
            variant="body1"
            className={[classes.spaced, classes.link].join(' ')}
            onClick={handleOpen}
          >
            <FormattedMessage
              id="update.openInCheck"
              defaultMessage="Open in Check"
            />
          </Typography>
        </Box>
      </Box>
      <Box className={classes.root}>
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
        >
          {projectMedia.type === 'Link' ? (
            <Tab
              value="media"
              label={
                <FormattedMessage id="update.media" defaultMessage="Media" />
              }
            />
          ) : null}
          <Tab
            value="metadata"
            label={
              <FormattedMessage id="update.annotation" defaultMessage="Annotation" />
            }
          />
          <Tab
            value="tasks"
            label={
              <FormattedMessage id="update.tasks" defaultMessage="Tasks" />
            }
          />
          <Tab
            value="source"
            label={
              <FormattedMessage id="update.source" defaultMessage="Source" />
            }
          />
        </Tabs>
        {tab === 'media' ? <Media projectMedia={projectMedia} /> : null}
        {tab === 'metadata' ? <Metadata {...{ initialQueryRef }} /> : null}
        {tab === 'tasks' || tab === 'source' ? (
          <Box className={classes.frameContainer}>
            {frameHeight === 0 ? (
              <Typography variant="body1" className={classes.spaced}>
                <FormattedMessage
                  id="update.loading"
                  defaultMessage="Loading…"
                />
              </Typography>
            ) : null}
            <iframe
              id="check-web-frame"
              className={classes.frame}
              src={`${baseUrl}/${tab}?token=${user.token}`}
              frameBorder="none"
              scrolling="no"
              style={{ height: frameHeight }}
            />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

Update.defaultProps = {
  justSaved: false,
  projectId: null,
};

Update.propTypes = {
  projectMedia: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
  justSaved: PropTypes.bool,
  projectId: PropTypes.number,
};

export default Update;
