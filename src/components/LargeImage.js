import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { View, Text } from 'react-native';
import filesizeParser from 'filesize-parser';
import prettyBytes from 'pretty-bytes';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePreview from './ImagePreview';

class LargeImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      size: false
    };
  }

  componentWillMount() {
    RNFetchBlob.fs.stat(this.props.image).then(stats => {
      this.props.callback({ filename: stats.filename });
      this.setState({ size: stats.size });
    });
  }

  render() {
    const environment = this.context.environment;
    const imagePath = this.props.image;
    const image = 'file://' + imagePath;

    return (
      <View id="largeimage">
        <QueryRenderer environment={environment}
          query={graphql`
            query LargeImageQuery {
              about {
                upload_max_size
              }
            }
          `}

          render={({error, props}) => {
            if (!error && props && props.about && this.state.size) {
              const bytes = filesizeParser(props.about.upload_max_size);
              const valid = this.state.size <= bytes ? true : false;
              const size = prettyBytes(this.state.size).toUpperCase();
              const max = props.about.upload_max_size.toUpperCase();

              return (
                <ImagePreview image={image} size={size} max={max} valid={valid} callback={this.props.callback} />
              );
            }
            else {
              return (
                <View>
                  <Text>...</Text>
                </View>
              );
            }
          }}
        />
      </View>
    );
  }
}

LargeImage.contextTypes = {
  environment: PropTypes.object
};

export default LargeImage;
