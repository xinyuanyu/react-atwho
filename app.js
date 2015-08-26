/**
 * Created by xiyu on 8/25/2015.
 */

'use strict';
let React = require('react');
let AtWhoReact = require('./src/AtWho.React');


let testData = [{name: 'Top-Level API'},
    {name: 'Component API'},
    {name: 'Component Specs and Lifecycle'},
    {name: 'Supported Tags and Attributes'},
    {name: 'Event System'},
    {name: 'DOM Differences'},
    {name: 'Special Non-DOM Attributes'},
    {name: 'Reconciliation'},
    {name: 'React (Virtual) DOM Terminology'}];

React.render(
    <AtWhoReact data={testData}/>,
    document.getElementById('input-container')
);