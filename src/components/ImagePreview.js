import React, { Component } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { FormattedMessage } from 'react-intl';

class ImagePreview extends Component {
  componentDidMount() {
    this.props.callback({ imageValid: this.props.valid });
  }

  render() {
    return (
      <View>
        <Image source={{ isStatic: true, uri: this.props.image }} style={{ width: Dimensions.get('window').width, height: 200 }} />
        { !this.props.valid ? <Text style={{ color: '#AA0000' }}><FormattedMessage id="LargeImage.tooLarge" defaultMessage="Sorry, this image is too large. Its size of {size} exceeds the maximum size of {max}." values={{ size: this.props.size, max: this.props.max }} /></Text> : null }
      </View>
    );
  }
}

export default ImagePreview;
