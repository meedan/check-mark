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
      createNew: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.saved) {
      this.setState({ createNew: false, selectedProject: null, selectedProjectId: null });
    }
  }

  onChange(selected, index) {
    const value = selected.value || selected;
    if (value) {
      const id = parseInt(value.split(':')[1], 10);
      this.setState({ selectedProject: value, selectedProjectId: id });
    }
  }

  openItem(projectMedia, project) {
    const projectPath = project ? '/project/' + project.dbid : ''
    const path = projectMedia.team.slug + projectPath + '/media/' + projectMedia.dbid;
    window.open(config.checkWebUrl + '/' + path);
  }

  newItem() {
    this.setState({ createNew: true });
  }

  render() {
    if (this.context.platform === 'mobile' || this.props.text || this.props.image) {
      const props = Object.assign({}, this.props);
      delete props.saveCallback;
      return (<Save {...props} />);
    }

    if (this.state.createNew) {
      return (<Save {...this.props} />);
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
                    project_ids
                    team {
                      name
                      id
                      dbid
                      slug
                    }
                    projects(first: 10000) {
                      edges {
                        node {
                          title,
                          dbid,
                          id,
                        }
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

            let lastProject = null;
            let lastProjectId = null;
            let lastProjectMedia = null;
            let mediaLastProject = null

            if (!error && props && props.project_medias) {
              props.project_medias.edges.forEach(function(pmNode) {
                const pm = pmNode.node;
                const team = pm.team;
                if (!teams[team.dbid]) {
                  teams[team.dbid] = Object.assign(team, { projects: {} });
                }
                mediaLastProject = pm.projects.edges;
                mediaLastProject = mediaLastProject[mediaLastProject.length - 1].node;
                if (!teams[team.dbid].projects[mediaLastProject.dbid]) {
                  teams[team.dbid].projects[mediaLastProject.dbid] = mediaLastProject;
                }
                lastProject = team.slug + ':' + mediaLastProject.dbid;
                lastProjectId = mediaLastProject.dbid;
                lastProjectMedia = pm;
                if (mediaLastProject.dbid === selectedProjectId) {
                  projectMedia = pm;
                }
              });

              if (!selectedProject) {
                selectedProject = lastProject;
              }
              if (!selectedProjectId) {
                selectedProjectId = lastProjectId;
              }
              if (!projectMedia) {
                projectMedia = lastProjectMedia;
              }

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
                  </Text>
                  <View style={{ marginTop: 16 }}>
                    <Text style={styles.p}>
                      <FormattedMessage
                        id="saveOrUpdate.header"
                        defaultMessage="This link exists in one or more projects, you can choose one of them below and answer the tasks. You can also {linkAdd} or {linkOpen}."
                        values={{
                          linkAdd: <Text onClick={this.newItem.bind(this)} style={styles.link}><FormattedMessage id="saveOrUpdate.linkAdd" defaultMessage="add it to another project" /></Text>,
                          linkOpen: <Text onClick={this.openItem.bind(this, projectMedia, mediaLastProject)} style={styles.link}><FormattedMessage id="saveOrUpdate.linkOpen" defaultMessage="open it in Check" /></Text>,
                        }}
                      />                
                    </Text>
                  </View>
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
