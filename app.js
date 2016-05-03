/**
 * Created by xiyu on 8/25/2015.
 */

'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import AtWhoReact from './src/AtWho.React';


let testData = [{ value: 'Top-Level API' },
    { value: 'Component API' },
    { value: 'Component Specs and Lifecycle' },
    { value: 'Supported Tags and Attributes' },
    { value: 'Event System' },
    { value: 'DOM Differences' },
    { value: 'Special Non-DOM Attributes' },
    { value: 'Reconciliation' },
    { value: 'React (Virtual) DOM Terminology' }];

ReactDOM.render(
    <AtWhoReact data={testData} />,
    document.getElementById('input-container')
);