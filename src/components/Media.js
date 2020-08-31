import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import MediaCell from './MediaCell';
import colors from './colors';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2),
  },
  link: {
    cursor: 'pointer',
    textDecoration: 'underline',
    color: colors.blue,
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
  },
}));

/* global window */

const Media = ({ metadata }) => {
  const classes = useStyles();

  const publishedOn = metadata.published_at ? new Date(metadata.published_at).toLocaleString() : null;
  const author = (metadata.author_name && metadata.author_url) ?
    `${metadata.author_name} (${metadata.author_url.replace(/^https?:\/\//, '')})` :
    (metadata.author_name || metadata.author_url);
  const metrics = {
    shares: 0,
    reactions: 0,
    comments: 0,
  };
  if (metadata.metrics && metadata.metrics.facebook) {
    metrics.shares = metadata.metrics.facebook.share_count;
    metrics.reactions = metadata.metrics.facebook.reaction_count;
    metrics.comments = metadata.metrics.facebook.comment_count + metadata.metrics.facebook.comment_plugin_count;
  }

  const openUrl = () => {
    window.open(metadata.url);
  };

  return (
    <Box id="media" className={classes.root}>
      <MediaCell
        label={<FormattedMessage id="media.title" defaultMessage="Title" />}
        value={metadata.title}
      />
      <MediaCell
        label={<FormattedMessage id="media.source" defaultMessage="Source" />}
        value={author}
      />
      <MediaCell
        label={<FormattedMessage id="media.publishedOn" defaultMessage="Published on" />}
        value={publishedOn}
      />
      <MediaCell
        label={<FormattedMessage id="media.url" defaultMessage="URL" />}
        value={<span onClick={openUrl} className={classes.link}>{metadata.url}</span>}
        bold={false}
      />
      <Box display="flex" justifyContent="space-between">
        <MediaCell
          label={<FormattedMessage id="media.shares" defaultMessage="FB Shares" />}
          value={metrics.shares}
        />
        <MediaCell
          label={<FormattedMessage id="media.reactions" defaultMessage="FB Reactions" />}
          value={metrics.reactions}
        />
        <MediaCell
          label={<FormattedMessage id="media.comments" defaultMessage="FB Comments" />}
          value={metrics.comments}
        />
      </Box>
      <MediaCell
        label={<FormattedMessage id="media.description" defaultMessage="Description" />}
        value={metadata.description}
        bold={false}
      />
    </Box>
  );
};

Media.propTypes = {
  metadata: PropTypes.object.isRequired,
};

export default Media;
