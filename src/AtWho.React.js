/**
 * Created by xiyu on 8/25/2015.
 */
'use strict';
import React, {PropTypes, Component} from 'react';
import AtWhoReactTmpl from './AtWho.React.Tmpl';

// TODO : 配置信息
const ATWHO_FLAG = '@';

const KEY_CODE = {
    DOWN: 40,
    UP: 38,
    ESC: 27,
    TAB: 9,
    ENTER: 13,
    WHITE_SPACE: 32
};

const OPTION_LIMIT = 8;

function checkContains(value, key, ignoreCase) {
    // TODO : need try-cache
    return ignoreCase ? value.toLowerCase().indexOf(key.toLowerCase()) !== -1
        : value.indexOf(key) !== -1;
}


export default class AtWhoReact extends Component {
    constructor(props) {
        super(props);
        // init state
        this.state = {
            text: '',
            showOption: false,
            optionPositionX: 0,
            optionPositionY: 0,
            searchKey: '',
            activeIndex: 0
        };
    }

    _onChange(event) {
        let value = event.target.value;
        this.setState({
            text: event.target.value
        })
    }

    _onKeyDown(event) {
        if (this.state.showOption &&
            (event.keyCode == KEY_CODE.DOWN || event.keyCode == KEY_CODE.UP
            || event.keyCode == KEY_CODE.ENTER)) {
            event.preventDefault();
        }
    }

    _onKeyUp(event) {
        let {data, maxedListCount, ignoreCase} = this.props;
        let { searchKey, activeIndex } = this.state;

        // TODO : change it to props
        if (event.keyCode === 50 && event.shiftKey) {
            // show list

            // calculate the position
            let atTargetInput = this.refs.atInput;
            let atTarget = this.refs.atTarget;


            if (!atTargetInput || !atTarget) {
                return;
            }

            let y = atTarget.offsetTop;
            let x = atTarget.offsetLeft;
            let h = atTarget.offsetHeight;
            if (h) {
                y += h;
            }
            this.setState({
                showOption: true,
                optionPositionX: x,
                optionPositionY: y
            });

        } else if (event.keyCode === KEY_CODE.WHITE_SPACE) {
            // hide the list
            this.setState({
                showOption: false,
                optionPositionX: 0,
                optionPositionY: 0,
                searchKey: '',
                activeIndex: 0
            });

        } else if (event.keyCode == KEY_CODE.DOWN || event.keyCode == KEY_CODE.UP) {
            // set active index
            event.preventDefault();

            let matchedList = data.filter(item=>checkContains(item.value, searchKey, ignoreCase));
            let matchedLength = Math.min(matchedList.length, maxedListCount);


            let activeIndexOffset = event.keyCode == KEY_CODE.DOWN ? 1 : -1;
            let currentIndex = (this.state.activeIndex || 0) + activeIndexOffset;
            while (currentIndex < 0) {
                currentIndex += matchedLength;
            }
            this.setState({
                activeIndex: currentIndex % matchedLength
            });

        } else if (event.keyCode == KEY_CODE.ENTER) {
            // choose option
            if (this.state.showOption) {
                activeIndex = activeIndex || 0;

                let optionFiltered = data
                    .filter(item => checkContains(item.value, searchKey, ignoreCase));
                let activeItem = optionFiltered[activeIndex];

                this.setState({
                    showOption: false,
                    optionPositionX: 0,
                    optionPositionY: 0,
                    searchKey: '',
                    activeIndex: 0,
                    text: this.state.text + activeItem.value + ' '
                });
            }
        } else {
            // filter the list
            let checkContent = /.*(@.*?)$/.exec(event.target.value);
            if (!checkContent) {
                // 隐藏
                this.setState({
                    showOption: false,
                    optionPositionX: 0,
                    optionPositionY: 0,
                    searchKey: '',
                    activeIndex: 0
                });
            } else {
                let checkContentValue = checkContent[checkContent.length - 1];
                checkContentValue = checkContentValue.split(' ').reverse()[0];
                if (checkContentValue.indexOf('@') != -1) {
                    this.setState({
                        searchKey: checkContentValue.replace('@', ''),
                        activeIndex: 0
                    });
                } else {
                    this.setState({
                        showOption: false,
                        optionPositionX: 0,
                        optionPositionY: 0,
                        searchKey: '',
                        activeIndex: 0
                    });
                }
            }
        }
    }

    componentDidMount() {
        // 计算部分css的值
        let atTargetInput = this.refs.atInput;
        let atTargetMirror = this.refs.atMirror;
        if (!atTargetInput || !atTargetMirror) {
            return;
        }

        let boundingTargetInput = atTargetInput.getBoundingClientRect();
        let width = boundingTargetInput.width;
        let height = boundingTargetInput.height;
        atTargetMirror.style.width = width + 'px';
        atTargetMirror.style.height = height + 'px';

        let cssAttr = ["overflowY", "height", "width", "paddingTop", "paddingLeft", "paddingRight",
            "paddingBottom", "marginTop", "marginLeft", "marginRight", "marginBottom", 'fontFamily',
            'borderStyle', 'borderWidth', 'wordWrap', 'fontSize', 'lineHeight', 'overflowX'];

        let targetComputedCSS = window.getComputedStyle(atTargetInput) ||
            atTargetInput.currentStyle;

        cssAttr.forEach(v=> {
            let existingValue = targetComputedCSS[v];
            if (typeof existingValue !== 'undefined') {
                atTargetMirror.style[v] = existingValue;
            }
        });

    }

    componentDidUpdate() {
        // TODO: might need to reset the style for targetMirror
    }

    render() {
        let optionListDOM = null;
        let searchKey = this.state.searchKey;
        let activeIndex = this.state.activeIndex || 0;
        const {style, activeStyle, className, activeClassName,
            maxedListCount, ignoreCase} = this.props;

        if (this.state.showOption) {
            let optionListData = this.props.data;

            optionListDOM = optionListData
                .filter(
                    (item, index)=>checkContains(item.value, searchKey, ignoreCase)
                ).filter(
                    (item, index)=>index < maxedListCount
                ).map((item, index)=> {
                    let active = activeIndex == index;
                    return (
                        <this.props.componentItem
                            key={index} value={item.value} active={active}
                            style={style} activeStyle={activeStyle}
                            className={className} activeClassName={activeClassName} />
                    )
                });
        }

        return (
            <div style={{position: 'relative'}}>

                <div ref='atMirror' style={{
                    position: 'absolute',
                    left: -9999,
                    top: 0,
                    zIndex: -20000,
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word'
                }}>
                    <span>{this.state.text}</span>
                    <span id="atTarget" ref='atTarget' />
                </div>


                <div ref='atView' style={{
                    left: this.state.optionPositionX,
                    top: this.state.optionPositionY,
                    display: this.state.showOption ? 'block' : 'none',
                    position: 'absolute',
                    backgroundColor: 'red'
                }}>{optionListDOM}</div>

                <textarea
                    ref='atInput'
                    onChange={this._onChange.bind(this)}
                    onKeyDown={this._onKeyDown.bind(this)}
                    onKeyUp={this._onKeyUp.bind(this)} value={this.state.text}
                    style={{height: 500, width: 900, fontSize:20}} />
            </div>
        )
    }

}

AtWhoReact.propTypes = {
    flag: PropTypes.string,
    data: PropTypes.array.isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    activeStyle: PropTypes.object,
    activeClassName: PropTypes.string,
    componentItem: PropTypes.any,
    maxedListCount: PropTypes.number,
    ignoreCase: PropTypes.bool
};

AtWhoReact.defaultProps = {
    flag: ATWHO_FLAG,
    data: [],
    style: { backgroundColor: 'grey' },
    activeStyle: { backgroundColor: 'green' },
    className: 'item',
    activeClassName: 'active',
    componentItem: AtWhoReactTmpl,
    maxedListCount: OPTION_LIMIT,
    ignoreCase: false
};