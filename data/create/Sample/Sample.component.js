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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Sample.style';

class Sample extends Component {
    render() {
        return (
            <main block="Sample">
                Add your content here
            </main>
        );
    }
}

Sample.propTypes = {
    sampleProp: PropTypes.any.isRequired
};

export default Sample;
