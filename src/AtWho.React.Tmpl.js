/**
 * Created by xiyu on 8/26/2015.
 */

'use strict';
import React, {Component, PropTypes} from 'react';

export default class AtWhoReactTmpl extends Component {
    render() {
        const {active, name,  style, className, activeStyle, activeClassName} = this.props;
        let {desc, value} = this.props;

        // set class and style
        let computedClassName = active ? className + ' ' + activeClassName : className;
        let computedStyle = active ? Object.assign({}, style, activeStyle) : style;

        // fix data
        value = value || name;
        desc = desc || value;

        return (
            <div style={computedStyle} className={computedClassName}>{desc}</div>
        );
    }
}

AtWhoReactTmpl.propTypes = {
    active: PropTypes.bool,
    desc: PropTypes.string,
    value: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    activeStyle: PropTypes.object,
    activeClassName: PropTypes.string
};
AtWhoReactTmpl.defaultProps = {
    active: false,
    desc: '',
    value: '',
    style: {},
    className: '',
    activeStyle: {},
    activeClassName: ''
};