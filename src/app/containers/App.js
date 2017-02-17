import { connect } from 'react-redux';

import Bridge from '../components/Bridge';
import * as bridgeActions from '../actions/bridge';

function mapStateToProps(state) {
  return { state: state };
}

const mapDispatchToProps = bridgeActions;

export default connect(mapStateToProps, mapDispatchToProps)(Bridge);
