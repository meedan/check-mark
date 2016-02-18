import React, { Component, PropTypes } from 'react';
import BridgeSelect from './BridgeSelect';
import Embedly from './Embedly';
import BackBar from './BackBar';

class SavePost extends Component {
  render() {
    const { loginTwitter, loginFacebook, goBack, savePost, submitPost, saveTranslation, submitTranslation, myTranslations, state } = this.props;
    return (
      <div>
        <BackBar goBack={goBack} myTranslations={myTranslations} />
        <div className="textured">
          <div className="light-gray-background">
            <h3 className="action">Save to existing project for translation</h3>
            <div className="column form-column">
              <Embedly url={state.extension.url} />
              <form onSubmit={submitPost.bind(this)}>
                <div>
                  <BridgeSelect name="project" objects={state.extension.projects} />
                  <BridgeSelect name="language" objects={state.extension.sourcelanguages} multi={true} />
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
