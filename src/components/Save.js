import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { commitMutation, graphql } from 'react-relay';
import { View, Text, Linking, Image, Dimensions } from 'react-native';
import Projects from './Projects';
import LargeImage from './LargeImage';
import Error from './Error';
import config from './../config';
import styles from './styles';
import { logout } from './../helpers';
import { createEnvironment } from './../relay/Environment';
import CheckError from '../CheckError';

const mutation = graphql`
  mutation SaveMutation(
    $input: CreateProjectMediaInput!
  ) {
    createProjectMedia(input: $input) {
      project_media {
        dbid
        oembed_metadata
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

class Save extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProject: null,
      selectedTeamSlug: null,
      showMenu: false,
      showSelect: false,
      state: 'invalid', // invalid, pending, saving, saved, failed
      result: null,
      filename: null,
      imageValid: false,
    };
  }

  getMetadata(key) {
    if (this.state.result) {
      const media = JSON.parse(this.state.result.createProjectMedia.project_media.oembed_metadata);
      return media[key];
    }
    return null;
  }

  onSelectProject(value) {
    const selected = value.split(':');
    let state = 'invalid';
    if (selected[1] && (!this.props.image || this.state.imageValid)) {
      state = 'pending';
    }
    this.setState({ state: state, selectedTeamSlug: selected[0], selectedProject: parseInt(selected[1], 10) });
  }

  onOpenSelect() {
    this.setState({ showSelect: true });
  }

  onCloseSelect() {
    this.setState({ showSelect: false });
  }

  toggleMenu(e) {
    if (this.context.platform !== 'mobile') {
      e.stopPropagation();
    }
    this.setState({ showMenu: !this.state.showMenu });
  }

  componentDidUpdate() {
    const that = this;
    if (this.context.platform !== 'mobile') {
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
    this.context.store.write('userToken', '', () => {
      logout(this.props.callback, this.context.user.token);
    });
    if (this.context.platform !== 'mobile') {
      this.openCheck('');
    }
  }

  ignore() {
  }

  saved(response) {
    const project = response.createProjectMedia.project_media.project;
    this.context.store.write('lastProject', project.team.slug + ':' + project.dbid, () => {
      if (this.context.platform !== 'mobile' && this.props.saveCallback) {
        this.props.saveCallback();
      }
      else {
        this.setState({ state: 'saved', result: response });
      }
    });
  }

  failed(error) {
    let message = <FormattedMessage id="Save.error" defaultMessage="Sorry, we encountered a problem adding this item to {app}." values={{ app: config.appName }} />;
    // Show the error message from the backend
    const { source } = error;
    if (source && source.errors && source.errors.length > 0) {
      const info = source.errors[0];
      if (info && info.code === CheckError.codes.DUPLICATED) {
        const link = `${config.checkWebUrl}/${this.state.selectedTeamSlug}/project/${info.data.project_id}/${info.data.type}/${info.data.id}`;
        const vals = {
          link: <Text onPress={this.openUrl.bind(this, link)}>{link}</Text>
        };
        message = <FormattedMessage id="Save.exists" defaultMessage="This link has already been saved to your project. You can view it here: {link}" values={vals} />;
      }
      else if (/413 Request Entity Too Large/.test(error.source.errors[0].error)) {
        message = <FormattedMessage id="Save.imageTooLarge" defaultMessage="Sorry, this image is too large." />;
      }
    }
    this.setState({ state: 'failed', result: message });
  }

  setImage(state) {
    const newState = state;
    if (state.imageValid && this.state.selectedProject) {
      newState.state = 'pending';
    }
    this.setState(newState);
  }

  save() {
    const that = this;

    if (!this.state.selectedProject || (this.props.image && !this.state.imageValid)) {
      return false;
    }

    let url = '';
    let text = '';
    let image = null;
    let filename = null;
    if (this.props.url && this.props.url !== '') {
      url = this.props.url;
    }
    if (this.props.text && this.props.text !== '') {
      text = this.props.text;
    }
    if (this.props.image) {
      image = this.props.image;
      filename = this.state.filename;
    }

    const variables = {
      input: {
        url: url,
        quote: text,
        project_id: this.state.selectedProject,
        clientMutationId: "1"
      }
    };

    const environment = createEnvironment(this.context.user.token, this.state.selectedTeamSlug, image, filename);

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
      if (action !== '') {
        path += '#' + action;
      }
      this.openCheck(path);
    }
  }

  render() {
    if (this.state.state === 'failed') {
      return (<Error messageComponent={this.state.result} />);
    }

    const windowHeight = this.context.platform === 'mobile' ? Dimensions.get('window').height : 'auto';

    const menuStyle = [styles.menuOption, this.state.state !== 'saved' && styles.menuOptionDisabled, this.state.state === 'saved' && styles.menuOptionActive];

    return (
     <View id="save" className={this.setClasses()} style={{ height: windowHeight }}>
        <Text id="title" style={styles.title}><FormattedMessage id="Save.addToApp" defaultMessage="Add to {app}" values={{ app: config.appName }} /></Text>

        <View id="menu-trigger" style={styles.trigger}>
          <Image source={require('./../assets/menu-trigger.png')} style={styles.triggerImage} />
          <Text onPress={this.toggleMenu.bind(this)} style={styles.touchable}></Text>
        </View>
        <View id="menu" style={[styles.menu, !this.state.showMenu && styles.menuClosed]}>
          <Text style={menuStyle} onPress={this.menuAction.bind(this, '')} className={ this.state.state === 'saved' ? 'active' : '' }><FormattedMessage id="Save.openInNewTab" defaultMessage="Open in new tab" /></Text>
          <Text style={menuStyle} onPress={this.menuAction.bind(this, 'edit-tags')} className={ this.state.state === 'saved' ? 'active' : '' }><FormattedMessage id="Save.editTags" defaultMessage="Edit tags" /></Text>
          <Text style={menuStyle} onPress={this.menuAction.bind(this, 'move')} className={ this.state.state === 'saved' ? 'active' : '' }><FormattedMessage id="Save.moveToProject" defaultMessage="Move to project" /></Text>
          <Text style={menuStyle} onPress={this.menuAction.bind(this, 'add-task')} className={ this.state.state === 'saved' ? 'active' : '' }><FormattedMessage id="Save.addTask" defaultMessage="Add task" /></Text>
          <Text style={menuStyle} onPress={this.menuAction.bind(this, 'edit-title')} className={ this.state.state === 'saved' ? 'active' : '' }><FormattedMessage id="Save.editTitle" defaultMessage="Edit title" /></Text>
          <View style={{ borderBottomColor: 'rgba(0, 0, 0, 0.16)', borderBottomWidth: 1 }}></View>
          <Text style={[ styles.menuOption, styles.menuOptionActive ]} onPress={this.openCheck.bind(this, 'check/me')} className="active"><FormattedMessage id="Save.myProfile" defaultMessage="My profile" /></Text>
          <Text style={[ styles.menuOption, styles.menuOptionActive ]} onPress={this.logout.bind(this)} className="active"><FormattedMessage id="Save.logOut" defaultMessage="Log out" /></Text>
        </View>

        <View style={{ marginTop: 16 }}>
          {this.state.state !== 'saved' ?
          <Projects onSelectProject={this.onSelectProject.bind(this)}
                    onOpenSelect={this.onOpenSelect.bind(this)}
                    onCloseSelect={this.onCloseSelect.bind(this)} />
          :
          <View id="project">
            <Image source={{ uri: this.state.result.createProjectMedia.project_media.project.team.avatar }} style={styles.teamAvatar} />
            <Text style={styles.projectTitle} id="project-title" title={this.state.result.createProjectMedia.project_media.project.title}>{this.state.result.createProjectMedia.project_media.project.title}</Text>
          </View>
          }

          <View id="preview" style={styles.preview}>
          { (this.state.state === 'saved' && this.state.result) ? <Text className="saved" onPress={this.openUrl.bind(this, this.getMetadata('permalink'))}>{this.getMetadata('title')}</Text> : (
            this.props.image ? <LargeImage image={this.props.image} callback={this.setImage.bind(this)} /> : (
            (this.props.text && this.props.text !== '') ?
              <Text title={this.props.text}>
                <FormattedMessage id="Save.claim" defaultMessage="Claim: {text}" values={{ text: this.props.text }} />
              </Text> :
              <Text title={this.props.url}>
                <FormattedMessage id="Save.link" defaultMessage="Link: {link}" values={{ link: this.props.url }} />
              </Text>
          ))}
          </View>
        </View>

        <View id="button" style={{ zIndex: -1 }}>
        { (this.state.state === 'pending' || this.state.state === 'invalid') ?
            <Text style={[styles.button2, styles[this.state.state]]} onPress={this.save.bind(this)} className="save" id="button-save"><FormattedMessage id="Save.save" defaultMessage="Save" /></Text>
          : (this.state.state === 'saving' ?
            <Text style={[styles.button2, styles[this.state.state]]} onPress={this.ignore.bind(this)} className="saving" id="button-saving"><FormattedMessage id="Save.saving" defaultMessage="Saving..." /></Text>
          : (this.state.state === 'saved' ?
            <View style={[styles.savedBar, { width: Dimensions.get('window').width }]} id="saved-bar">
              <Text style={[styles.button3, styles[this.state.state]]} onPress={this.ignore.bind(this)} className="saved" id="button-saved"><FormattedMessage id="Save.saved" defaultMessage="Saved!" /></Text>
              <Text style={styles.button3} id="button-view" onPress={this.openUrl.bind(this, this.getMetadata('permalink'))}><FormattedMessage id="Save.view" defaultMessage="View" /></Text>
            </View>
          : null))
        }
        </View>
      </View>
    );
  }
}

Save.propTypes = {
  intl: intlShape.isRequired,
};

Save.contextTypes = {
  user: PropTypes.object,
  store: PropTypes.object,
  platform: PropTypes.string
};

export default injectIntl(Save);
