import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Projects from './Projects';
import Button from './Button';
import '../style/Save.css';
import config from '../config';
import { logout } from '../helpers';

class Save extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProject: null,
      showMenu: false,
      showSelect: false,
      saved: false
    };
  }

  onSelectProject(option) {
    this.setState({ selectedProject: option.value });
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
    const that = this;
    logout(function() {
      that.openCheck('');
    });
  }

  render() {
    return (
      <div id="save" className={this.setClasses()}>
        <h2><FormattedMessage id="Save.addToCheck" defaultMessage="Add to Check" /></h2>

        <div id="menu-trigger" onClick={this.toggleMenu.bind(this)}></div>
        <ul id="menu">
          <li className={ this.state.saved ? 'active' : '' }><FormattedMessage id="Save.openInNewTab" defaultMessage="Open in new tab" /></li>
          <li className={ this.state.saved ? 'active' : '' }><FormattedMessage id="Save.editTags" defaultMessage="Edit tags" /></li>
          <li className={ this.state.saved ? 'active' : '' }><FormattedMessage id="Save.moveToProject" defaultMessage="Move to project" /></li>
          <li className={ this.state.saved ? 'active' : '' }><FormattedMessage id="Save.addTask" defaultMessage="Add task" /></li>
          <li className={ this.state.saved ? 'active' : '' }><FormattedMessage id="Save.editTitleOrDescription" defaultMessage="Edit title or description" /></li>
          <hr />
          <li onClick={this.openCheck.bind(this, 'check/me')} className="active"><FormattedMessage id="Save.myProfile" defaultMessage="My profile" /></li>
          <li onClick={this.logout.bind(this)} className="active"><FormattedMessage id="Save.logOut" defaultMessage="Log out" /></li>
        </ul>

        <div>
          <Projects onSelectProject={this.onSelectProject.bind(this)} 
                    onOpenSelect={this.onOpenSelect.bind(this)}
                    onCloseSelect={this.onCloseSelect.bind(this)} />
          <span id="preview"><FormattedMessage id="Save.link" defaultMessage="Link: {link}" values={{ link: this.props.url }} /></span>
        </div>

        <Button label={<FormattedMessage id="Save.save" defaultMessage="Save" />} />
      </div>
    );
  }
}

export default Save;
