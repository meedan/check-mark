import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert, Text, View, Picker } from 'react-native';
import Select from './Select';
import util from 'util';

/*global chrome*/

class Projects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProject: null
    };
  }

  componentWillMount() {
    // chrome.storage.sync.get('lastProject', (data) => {
    //   const value = data.lastProject;
    //   if (value) {
    //     this.props.onSelectProject({ value });
    //     this.setState({ selectedProject: value });
    //   }
    // });
  }

  onChange(selected, index) {
    const value = selected.value || selected;
    this.props.onSelectProject(value);
    this.setState({ selectedProject: value });
  }

  render() {
    const environment = this.context.environment;

    return (
      <View id="projects">
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
            let options = [];

            if (!error && props && props.me) {
              props.me.team_users.edges.forEach(function(teamUserNode) {
                if (teamUserNode.node.status === 'member') {
                  const team = teamUserNode.node.team;
                  if (team.limits.browser_extension !== false) {
                    let group = { label: team.name, options: [] };
                    team.projects.edges.forEach(function(projectNode) {
                      const project = projectNode.node;
                      const option = { label: project.title, value: team.slug + ':' + project.dbid };
                      group.options.push(option);
                      option.label = team.name + ': ' + project.title;
                      options.push(option);
                    });
                    groups.push(group);
                  }
                }
              });

              if (groups.length > 0) {
                return (<Select selectedValue={this.state.selectedProject} onValueChange={this.onChange.bind(this)} options={options} groups={groups} />);
              }
              else {
                return <Text>No teams allowed to use the mobile app.</Text>;
              }
            }
            else {
              return <Text>...</Text>;
            }
          }}
        />
      </View>
    );
  }
}

Projects.contextTypes = {
  environment: PropTypes.object,
  platform: PropTypes.string
};

export default Projects;
