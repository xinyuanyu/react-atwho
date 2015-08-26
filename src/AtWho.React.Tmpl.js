/**
 * Created by xiyu on 8/26/2015.
 */

'use strict';

let React = require('react');

let AtWhoReactTmpl = React.createClass({
    render() {
        let name = this.props.name;
        let active = this.props.active;
        return (
            <li style={active ? {backgroundColor: 'green'} : {}}>{name}</li>
        );
    }
});

module.exports = AtWhoReactTmpl;