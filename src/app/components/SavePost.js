import React, { Component, PropTypes } from 'react';
import BridgeSelect from './BridgeSelect';
import Embedly from './Embedly';
import BackBar from './BackBar';

class SavePost extends Component {
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

export default SavePost;
