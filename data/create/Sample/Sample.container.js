/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { connect } from 'react-redux';
import { SampleDispatcher } from 'Store/Sample';
import Sample from './Sample.component';

// Remove this if no state is mapped
const mapStateToProps = state => ({
    sampleProp: state.SampleReducer.sampleProp
});

// Remove this if no dispatches are mapped
const mapDispatchToProps = dispatch => ({
    sampleDispatch: (someProps) => {
        SampleDispatcher.someFunction(someProps, dispatch);
    }
});

const SampleContainer = connect(mapStateToProps, mapDispatchToProps)(Sample);

export default SampleContainer;
