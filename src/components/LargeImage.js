import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { QueryRenderer, graphql } from 'react-relay';
import { View, Text, Image, Dimensions } from 'react-native';
import filesizeParser from 'filesize-parser';
import prettyBytes from 'pretty-bytes';
import RNFetchBlob from 'react-native-fetch-blob';

class LargeImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      size: false
    };
  }

  componentWillMount() {
    RNFetchBlob.fs.stat(this.props.image).then(stats => {
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

              return (
                <View>
                  <Image source={{ isStatic: true, uri: image }} style={{ width: Dimensions.get('window').width, height: 200 }} />
                  { this.state.size > bytes ? <Text style={{ color: '#AA0000' }}><FormattedMessage id="LargeImage.tooLarge" defaultMessage="Sorry, your file size ({size}) exceeds the maximum size of {max}" values={{ size: prettyBytes(this.state.size).toUpperCase(), max: props.about.upload_max_size.toUpperCase() }} /></Text> : null }
                </View>
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
