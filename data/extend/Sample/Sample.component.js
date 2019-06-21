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

import React from 'react';
import SourceSample from 'SourceComponent/Sample/Sample.component';

class Sample extends SourceSample {
    // Override source functions you need here. Example render()

    render() {
        return (
            <main block="Sample">
                Your extended content goes here
            </main>
        );
    }
}

export default Sample;
