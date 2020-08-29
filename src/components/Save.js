import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { commitMutation, graphql } from 'react-relay';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import Title from './Title';
import Message from './Message';
import Menu from './Menu';
import colors from './colors';

const useStyles = makeStyles(theme => ({
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
  button: {
    background: colors.blue,
  },
}));

const Save = ({ user, environment, text, url, onSave, onLogout }) => {
  const classes = useStyles();

  let team = null;
  if (user && user.current_team) {
    team = user.current_team;
  } else {
    return (
      <Message>
        <FormattedMessage id="save.noTeam" defaultMessage="You must be a member of at least one team in order to use the browser extension." />
      </Message>
    );
  }
  
  const [project, setProject] = React.useState(team.projects[0]);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState(null);

  const handleChangeProject = (newProject) => {
    setProject(newProject);
  };

  const handleSave = () => {
    setSaving(true);

    const mutation = graphql`
      mutation SaveMutation(
        $input: CreateProjectMediaInput!
      ) {
        createProjectMedia(input: $input) {
          project_media {
            dbid
            type
            media {
              metadata
            }
            metrics: annotation(annotation_type: "metrics") {
              data
            }
            team {
              name
              slug
            }
          }
        }
      }
    `;

    const variables = {
      input: {
        url: url,
        quote: text,
        clientMutationId: '1',
      }
    };
    if (project) {
      variables.input.add_to_project_id = project.dbid;
    }

    commitMutation(
      environment,
      {
        mutation,
        variables,
        onCompleted: (response) => {
          setSaving(false);
          onSave(response.createProjectMedia.project_media, project);
        },
        onError: (error) => {
          const { source } = error;
          let errorMessage = null;
          try {
            errorMessage = (<div dangerouslySetInnerHTML={{ __html: source.errors[0].message }} />);
          } catch(e) {
            errorMessage = (<FormattedMessage id="save.error" defaultMessage="Error" />);
          }
          setMessage(errorMessage);
          setSaving(false);
        }
      },
    );
  };

  return (
    <Box id="save">
      <Box className={classes.header}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Title />
          <Menu onLogout={onLogout} />
        </Box>
        <Typography variant="body1" className={classes.heading}>
          {team.name}
        </Typography>
        <Typography variant="body1" className={classes.spaced}>
          <FormattedMessage id="save.saveTo" defaultMessage="Save to:" />
        </Typography>
        <Box>
          <Autocomplete
            value={project}
            onChange={(event, newValue) => {
              handleChangeProject(newValue);
            }}
            className={classes.select}
            options={team.projects}
            getOptionLabel={(project) => project.title}
            renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
            fullWidth
          />
        </Box>
      </Box>
      <Box className={classes.root}>
        <Box className={classes.spaced}>
          <TextField
            label={
              url ?
                <FormattedMessage id="save.url" defaultMessage="Link URL" /> :
                <FormattedMessage id="save.text" defaultMessage="Text claim" />
            }
            defaultValue={url || text}
            variant="outlined"
            multiline={Boolean(text)}
            rowsMax={8}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>
        <Box className={classes.spaced}>
          <Button id="save-button" variant="contained" color="primary" className={classes.button} onClick={handleSave} disabled={saving}>
          { saving ?
            <FormattedMessage id="save.saving" defaultMessage="Saving..." /> :
            <FormattedMessage id="save.save" defaultMessage="Save" />
          }
          </Button>
        </Box>
        <Box className={classes.spaced}>
          { message ? <Typography variant="body1" color="error">{message}</Typography> : null }
        </Box>
      </Box>
    </Box>
  );
};

Save.defaultProps = {
  text: null,
  url: null,
};

Save.propTypes = {
  user: PropTypes.object.isRequired,
  environment: PropTypes.object.isRequired,
  text: PropTypes.string,
  url: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Save;
