import React, { Component, PropTypes } from 'react';
import BridgeSelect from './BridgeSelect';
import injectTapEventPlugin from 'react-tap-event-plugin';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { blue500, blue600, blue700, blue800 } from 'material-ui/styles/colors';
import Embedly from './Embedly';
import BackBar from './BackBar';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#2e77fc',
    primary2Color: '#2e77fc',
    primary3Color: '#2e77fc',
    accent1Color: blue600,
    accent2Color: blue700,
    accent3Color: blue800,
  },
});

class SavePost extends React.Component {

  getChildContext() {
      return { muiTheme: muiTheme};
  }

  render() {
      const { loginTwitter, loginFacebook, goBack, savePost, submitPost, myTranslations, state } = this.props;
      return (
        <div>
          <div className="textured">
            <div className="light-gray-background">
              <h3 className="action">Save Current Link to Check</h3>
              <div className="column form-column">
                { state.extension.selection ? <div id="quote">{state.extension.selection}</div> : <Embedly url={state.extension.url} /> }
                <form onSubmit={submitPost.bind(this)}>
                  <div>
                    <BridgeSelect name="project" objects={state.extension.projects} />
                    <TextField
                      hintText={'Enter comment here:'}
                      fullWidth={false}
                      style={{ width: '100%' }}
                      name="cmd" id="cmd-input"
                    />
                  </div>
                  <button className="btn btn-large" id="submit">Add to Project</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }

}

SavePost.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
};

export default SavePost;
