import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import { commitMutation, graphql } from 'react-relay';
import { View, Text, Linking, Button, Image } from 'react-native';
import Projects from './Projects';
import Error from './Error';
import config from './../config';
import { logout } from './../helpers';
import { createEnvironment } from './../relay/Environment'; 

/*global chrome*/

const mutation = graphql`
  mutation SaveMutation(
    $input: CreateProjectMediaInput!
  ) {
    createProjectMedia(input: $input) {
      project_media {
        dbid
        metadata
        project {
          dbid
          title
          team {
            slug
            avatar
          }
        }
      }
    }
  }
`;

const messages = defineMessages({
  save: {
    id: 'Save.save',
    defaultMessage: 'Save',
  },
  saving: {
    id: 'Save.saving',
    defaultMessage: 'Saving',
  },
  saved: {
    id: 'Save.saved',
    defaultMessage: 'Saved',
  },
});

class Save extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProject: null,
      selectedTeamSlug: null,
      showMenu: false,
      showSelect: false,
      state: 'pending', // pending, saving, saved, failed
      result: null
    };
  }

  getMetadata(key) {
    if (this.state.result) {
      const media = JSON.parse(this.state.result.createProjectMedia.project_media.metadata);
      return media[key];
    }
    return null;
  }

  onSelectProject(value) {
    const selected = value.split(':');
    this.setState({ selectedTeamSlug: selected[0], selectedProject: parseInt(selected[1]) });
  }

  onOpenSelect() {
    this.setState({ showSelect: true });
  }

  onCloseSelect() {
    this.setState({ showSelect: false });
  }

  toggleMenu(e) {
    if (this.context.platform != 'mobile') {
      e.stopPropagation();
    }
    this.setState({ showMenu: !this.state.showMenu });
  }

  componentDidUpdate() {
    const that = this;
    if (this.context.platform != 'mobile') {
      window.addEventListener('click', function() {
        that.setState({ showMenu: false });
      });
    }
  }

  setClasses() {
    let classes = '';
    classes += this.state.showMenu ? 'menu-displayed' : 'menu-hidden';
    classes += this.state.showSelect ? ' select-displayed' : ' select-hidden';
    return classes;
  }

  openCheck(path) {
    this.openUrl(config.checkWebUrl + '/' + path);
  }

  openUrl(url) {
    this.context.platform === 'mobile' ? Linking.openURL(url) : window.open(url);
  }

  logout() {
    logout();
    this.openCheck('');
  }

  ignore() {
  }

  saved(response) {
    // const project = response.createProjectMedia.project_media.project;
    // chrome.storage.sync.set({ 'lastProject': project.team.slug + ':' + project.dbid }, () => {
      this.setState({ state: 'saved', result: response });
    // });
  }

  failed(error) {
    let message = <FormattedMessage id="Save.error" defaultMessage="Sorry, we encountered a problem adding this to Check." />;
    // Show the error message from the backend
    // if (error && error.source && error.source.errors && error.source.errors.length > 0) {
    //   message = error.source.errors[0];
    // }
    this.setState({ state: 'failed', result: message });
  }

  save() {
    const that = this;

    let url = '';
    let text = '';
    if (this.props.url && this.props.url != '') {
      url = this.props.url;
    }
    if (this.props.text && this.props.text != '') {
      text = this.props.text;
    }

    const variables = {
      input: {
        url: url,
        quote: text,
        project_id: this.state.selectedProject,
        clientMutationId: "1"
      }
    };

    const environment = createEnvironment(this.context.user.token, this.state.selectedTeamSlug);

    commitMutation(
      environment,
      {
        mutation,
        variables,
        onCompleted: (response) => {
          that.saved(response);
        },
        onError: (error) => {
          that.failed(error);
        }
      },
    );
    
    that.setState({ state: 'saving' });
  }

  menuAction(action) {
    if (this.state.state === 'saved') {
      const media = this.state.result.createProjectMedia.project_media;
      let path = media.project.team.slug + '/project/' + media.project.dbid + '/media/' + media.dbid;
      if (action != '') {
        path += '#' + action;
      }
      this.openCheck(path);
    }
  }

  render() {
    if (this.state.state === 'failed') {
      return (<Error messageComponent={this.state.result} />);
    }

    return (
     <View id="save" className={this.setClasses()}>
        <View><FormattedMessage id="Save.addToCheck" defaultMessage="Add to Check" /></View>

        <View id="menu-trigger" onPress={this.toggleMenu.bind(this)}><FormattedMessage id="Save.menu" defaultMessage="Menu" /></View>
        <View id="menu">
          <Text onPress={this.menuAction.bind(this, '')} className={ this.state.state === 'saved' ? 'active' : '' }><FormattedMessage id="Save.openInNewTab" defaultMessage="Open in new tab" /></Text>
          <Text onPress={this.menuAction.bind(this, 'edit-tags')} className={ this.state.state === 'saved' ? 'active' : '' }><FormattedMessage id="Save.editTags" defaultMessage="Edit tags" /></Text>
          <Text onPress={this.menuAction.bind(this, 'move')} className={ this.state.state === 'saved' ? 'active' : '' }><FormattedMessage id="Save.moveToProject" defaultMessage="Move to project" /></Text>
          <Text onPress={this.menuAction.bind(this, 'add-task')} className={ this.state.state === 'saved' ? 'active' : '' }><FormattedMessage id="Save.addTask" defaultMessage="Add task" /></Text>
          <Text onPress={this.menuAction.bind(this, 'edit-title')} className={ this.state.state === 'saved' ? 'active' : '' }><FormattedMessage id="Save.editTitle" defaultMessage="Edit title" /></Text>
          <View style={{ borderBottomColor: 'black', borderBottomWidth: 1 }}></View>
          <Text onPress={this.openCheck.bind(this, 'check/me')} className="active"><FormattedMessage id="Save.myProfile" defaultMessage="My profile" /></Text>
          <Text onPress={this.logout.bind(this)} className="active"><FormattedMessage id="Save.logOut" defaultMessage="Log out" /></Text>
        </View>

        <View>
          {this.state.state != 'saved' ?
          <Projects onSelectProject={this.onSelectProject.bind(this)} 
                    onOpenSelect={this.onOpenSelect.bind(this)}
                    onCloseSelect={this.onCloseSelect.bind(this)} />
          :
          <View id="project">
            <Text>Saved</Text>
            <Image source={{ uri: this.state.result.createProjectMedia.project_media.project.team.avatar }} style={{ width: 50, height: 50 }} /> 
            <Text title={this.state.result.createProjectMedia.project_media.project.title}>{this.state.result.createProjectMedia.project_media.project.title}</Text>
          </View>
          }

          <View id="preview">
          { (this.state.state === 'saved' && this.state.result) ? <Text className="saved" onPress={this.openUrl.bind(this, this.getMetadata('permalink'))}>{this.getMetadata('title')}</Text> : (
            (this.props.text && this.props.text != '') ?
              <View title={this.props.text}>
                <FormattedMessage id="Save.claim" defaultMessage="Claim: {text}" values={{ text: this.props.text }} />
              </View> :
              <View title={this.props.url}>
                <FormattedMessage id="Save.link" defaultMessage="Link: {link}" values={{ link: this.props.url }} />
              </View>
          )}
          </View>
        </View>
        
        { this.state.state === 'pending' ? 
            <Button onPress={this.save.bind(this)} title={this.props.intl.formatMessage(messages.save)} />
          : (this.state.state === 'saving' ?
            <Button onPress={this.ignore.bind(this)} className="saving" title={this.props.intl.formatMessage(messages.saving)} />
          : (this.state.state === 'saved' ?
            <Button onPress={this.ignore.bind(this)} className="saved" title={this.props.intl.formatMessage(messages.saved)} />
          : null)) }
      </View>
    );
  }
}

Save.propTypes = {
  intl: intlShape.isRequired,
};


Save.contextTypes = {
  user: PropTypes.object,
  platform: PropTypes.string
};

export default injectIntl(Save);
