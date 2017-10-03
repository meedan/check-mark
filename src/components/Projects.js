import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { QueryRenderer, graphql } from 'react-relay';
import Select from 'react-select-plus';
import '../style/Projects.css';
import 'react-select-plus/dist/react-select-plus.css';

/*global chrome*/

class Projects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProject: null
    };
  }

  componentWillMount() {
    chrome.storage.sync.get('lastProject', (data) => {
      const value = data.lastProject;
      if (value) {
        this.props.onSelectProject({ value });
        this.setState({ selectedProject: value });
      }
    });
  }

  onChange(value) {
    this.props.onSelectProject(value);
    this.setState({ selectedProject: value });
  }

  render() {
    const environment = this.context.environment;

    return (
      <div id="projects">
        <QueryRenderer environment={environment}
          query={graphql`
            query ProjectsQuery {
              me {
                team_users {
                  edges {
                    node {
                      status
                      team {
                        limits
                        avatar
                        slug
                        name
                        projects {
                          edges {
                            node {
                              title
                              dbid
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          `}

          render={({error, props}) => {
            let groups = [];
            
            if (!error && props && props.me) {
              props.me.team_users.edges.forEach(function(teamUserNode) {
                if (teamUserNode.node.status === 'member') {
                  const team = teamUserNode.node.team;
                  if (team.limits.browser_extension !== false) {
                    let group = { label: <span><img src={team.avatar} alt="" /> {team.name}</span>, options: [] };
                    team.projects.edges.forEach(function(projectNode) {
                      const project = projectNode.node;
                      const option = { label: project.title, value: team.slug + ':' + project.dbid };
                      group.options.push(option);
                    });
                    groups.push(group);
                  }
                }
              });
            }

            return <Select onChange={this.onChange.bind(this)}
                           onOpen={this.props.onOpenSelect ? this.props.onOpenSelect : null}
                           onClose={this.props.onCloseSelect ? this.props.onCloseSelect : null}
                           options={groups}
                           placeholder={<FormattedMessage id="Projects.select" defaultMessage="Select..." />}
                           value={this.state.selectedProject} />;
          }}
        />
      </div>
    );
  }
}

Projects.contextTypes = {
  environment: PropTypes.object
};

export default Projects;
