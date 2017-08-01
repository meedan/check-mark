import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { commitMutation, graphql } from 'react-relay';
import Projects from './Projects';
import Button from './Button';
import Error from './Error';
import config from '../config';
import { logout } from '../helpers';
import { createEnvironment } from '../relay/Environment'; 
import '../style/Save.css';

const mutation = graphql`
  mutation SaveMutation(
    $input: CreateProjectMediaInput!
  ) {
    createProjectMedia(input: $input) {
      project_media {
        dbid
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
      state: 'pending', // pending, saving, saved, failed
      result: null
    };
  }

  onSelectProject(option) {
    const selected = option.value.split(':');
    this.setState({ selectedTeamSlug: selected[0], selectedProject: parseInt(selected[1]) });
  }

  onOpenSelect() {
    this.setState({ showSelect: true });
  }

  onCloseSelect() {
    this.setState({ showSelect: false });
  }

  toggleMenu(e) {
    e.stopPropagation();
    this.setState({ showMenu: !this.state.showMenu });
  }

  componentDidUpdate() {
    const that = this;
    window.addEventListener('click', function() {
      that.setState({ showMenu: false });
    });
  }

  setClasses() {
    let classes = '';
    classes += this.state.showMenu ? 'menu-displayed' : 'menu-hidden';
    classes += this.state.showSelect ? ' select-displayed' : ' select-hidden';
    return classes;
  }

  openCheck(path) {
    window.open(config.checkWebUrl + '/' + path);
  }

  logout() {
    logout();
    this.openCheck('');
  }

  saved(response) {
    this.setState({ state: 'saved', result: response });
  }

  failed(error) {
    this.setState({ state: 'failed', result: error });
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
      return (<Error message={this.state.result.toString()} />);
    }

    return (
      <div id="save" className={this.setClasses()}>
        <h2><FormattedMessage id="Save.addToCheck" defaultMessage="Add to Check" /></h2>

        <div id="menu-trigger" onClick={this.toggleMenu.bind(this)}></div>
        <ul id="menu">
          <li onClick={this.menuAction.bind(this, '')} className={ this.state.state === 'saved' ? 'active' : '' }><FormattedMessage id="Save.openInNewTab" defaultMessage="Open in new tab" /></li>
          <li onClick={this.menuAction.bind(this, 'edit-tags')} className={ this.state.state === 'saved' ? 'active' : '' }><FormattedMessage id="Save.editTags" defaultMessage="Edit tags" /></li>
          <li onClick={this.menuAction.bind(this, 'move')} className={ this.state.state === 'saved' ? 'active' : '' }><FormattedMessage id="Save.moveToProject" defaultMessage="Move to project" /></li>
          <li onClick={this.menuAction.bind(this, 'add-task')} className={ this.state.state === 'saved' ? 'active' : '' }><FormattedMessage id="Save.addTask" defaultMessage="Add task" /></li>
          <li onClick={this.menuAction.bind(this, 'edit-title')} className={ this.state.state === 'saved' ? 'active' : '' }><FormattedMessage id="Save.editTitle" defaultMessage="Edit title" /></li>
          <hr />
          <li onClick={this.openCheck.bind(this, 'check/me')} className="active"><FormattedMessage id="Save.myProfile" defaultMessage="My profile" /></li>
          <li onClick={this.logout.bind(this)} className="active"><FormattedMessage id="Save.logOut" defaultMessage="Log out" /></li>
        </ul>

        <div>

          {this.state.state != 'saved' ?
          <Projects onSelectProject={this.onSelectProject.bind(this)} 
                    onOpenSelect={this.onOpenSelect.bind(this)}
                    onCloseSelect={this.onCloseSelect.bind(this)} />
          :
          <div id="project">
            <img src={this.state.result.createProjectMedia.project_media.project.team.avatar} alt="" /> 
            <span title={this.state.result.createProjectMedia.project_media.project.title}>{this.state.result.createProjectMedia.project_media.project.title}</span>
          </div>
          }

          <span id="preview">
            { this.props.text && this.props.text != '' ?
              <span title={this.props.text}>
                <FormattedMessage id="Save.claim" defaultMessage="Claim: {text}" values={{ text: this.props.text }} />
              </span> :
              <span title={this.props.url}>
                <FormattedMessage id="Save.link" defaultMessage="Link: {link}" values={{ link: this.props.url }} />
              </span>
            }
          </span>
        </div>

        { this.state.state === 'pending' ? 
            <Button onClick={this.save.bind(this)} label={<FormattedMessage id="Save.save" defaultMessage="Save" />} />
          : (this.state.state === 'saving' ?
            <Button onClick={null} className="saving" label={<FormattedMessage id="Save.saving" defaultMessage="Saving..." />} />
          : (this.state.state === 'saved' ?
            <Button onClick={null} className="saved" label={<FormattedMessage id="Save.saved" defaultMessage="Saved" />} />
          : null)) }
      </div>
    );
  }
}

Save.contextTypes = {
  user: PropTypes.object
};

export default Save;
