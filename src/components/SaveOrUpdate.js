import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { View, Text, Image } from 'react-native';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import config from './../config';
import styles from './styles';
import Save from './Save';
import Update from './Update';
import Select from './Select';

class SaveOrUpdate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProject: null,
      selectedProjectId: null,
    };
  }

  onChange(selected, index) {
    const value = selected.value || selected;
    if (value) {
      const id = parseInt(value.split(':')[1], 10);
      this.setState({ selectedProject: value, selectedProjectId: id });
    }
  }

  openItem(projectMedia) {
    const path = projectMedia.project.team.slug + '/project/' + projectMedia.project_id + '/media/' + projectMedia.dbid;
    window.open(config.checkWebUrl + '/' + path);
  }

  render() {
    if (this.context.platform === 'mobile' || this.props.text || this.props.image) {
      const props = Object.assign({}, this.props);
      delete props.saveCallback;
      return (<Save {...props} />);
    }

    const environment = this.context.environment;

    return (
      <View id="saveorupdate">
        <QueryRenderer environment={environment}
          query={graphql`
            query SaveOrUpdateQuery($url: String!) {
              project_medias(url: $url) {
                edges {
                  node {
                    id
                    dbid
                    title
                    project_id
                    project {
                      id
                      dbid
                      title
                      team {
                        name
                        id
                        dbid
                        slug
                      }
                    }
                  }
                }
              }
            }
          `}

          variables={{
            url: this.props.url,
          }}

          render={({error, props}) => {
            const groups = [];
            const options = [];
            const teams = {};
            let selectedProject = this.state.selectedProject;
            let selectedProjectId = this.state.selectedProjectId;
            let projectMedia = null;

            if (!error && props && props.project_medias) {
              props.project_medias.edges.forEach(function(pmNode) {
                const pm = pmNode.node;
                const team = pm.project.team;
                if (!teams[team.dbid]) {
                  teams[team.dbid] = Object.assign(team, { projects: {} });
                }
                if (!teams[team.dbid].projects[pm.project_id]) {
                  teams[team.dbid].projects[pm.project_id] = pm.project;
                }
                if (!selectedProject && !selectedProjectId) {
                  selectedProject = team.slug + ':' + pm.project.dbid;
                  selectedProjectId = pm.project.dbid;
                }
                if (pm.project_id === selectedProjectId) {
                  projectMedia = pm;
                }
              });

              for (let tid in teams) {
                const team = teams[tid];
                let group = { label: team.name, options: [] };
                for (let pid in team.projects) {
                  const project = team.projects[pid];
                  const option = { label: project.title, value: team.slug + ':' + project.dbid };
                  group.options.push(option);
                  option.label = team.name + ': ' + project.title;
                  options.push(option);
                }
                groups.push(group);
              }

              if (groups.length === 0) {
                return (<Save {...this.props} />);
              }

              return (
                <div>
                  <Text id="title" style={styles.title}>
                    {projectMedia.title}
                    <Image
                      source={require('./../assets/link.png')}
                      style={styles.linkImage}
                      onClick={this.openItem.bind(this, projectMedia)}
                    />
                  </Text>
                  <View style={{ marginTop: 16 }}>
                    <Select selectedValue={selectedProject} onValueChange={this.onChange.bind(this)} options={options} groups={groups} />
                    <Update projectMedia={projectMedia} />
                  </View>
                </div>
              );
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

SaveOrUpdate.contextTypes = {
  environment: PropTypes.object,
  store: PropTypes.object,
  platform: PropTypes.string
};

SaveOrUpdate.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(SaveOrUpdate);
