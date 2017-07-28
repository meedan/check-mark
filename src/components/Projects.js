import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import Select from 'react-select-plus';
import '../style/Projects.css';
import 'react-select-plus/dist/react-select-plus.css';

class Projects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProject: null
    };
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
                teams {
                  edges {
                    node {
                      avatar
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
          `}

          render={({error, props}) => {
            let groups = [];
            if (!error && props && props.me) {
              props.me.teams.edges.forEach(function(teamNode) {
                const team = teamNode.node;
                let group = { label: <span><img src={team.avatar} alt="" /> {team.name}</span>, options: [] };
                team.projects.edges.forEach(function(projectNode) {
                  const project = projectNode.node;
                  const option = { label: project.title, value: project.dbid };
                  group.options.push(option);
                });
                groups.push(group);
              });
            }
            return <Select onChange={this.onChange.bind(this)}
                           onOpen={this.props.onOpenSelect ? this.props.onOpenSelect : null}
                           onClose={this.props.onCloseSelect ? this.props.onCloseSelect : null}
                           options={groups}
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
