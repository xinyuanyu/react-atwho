/**
 * Created by xiyu on 8/25/2015.
 */
'use strict';

let React = require('react');

// component
let AtWhoReactTmpl = require('./AtWho.React.Tmpl');

// utils
let $ = require('jquery');
let _ = require('underscore');


// 配置信息
let ATWHOREACT_CONFIG = {
    flag: '@'
};

let KEY_CODE = {
    DOWN: 40,
    UP: 38,
    ESC: 27,
    TAB: 9,
    ENTER: 13,
    WHITE_SPACE: 32
};

let OPTION_LIMIT = 5;

function getInitState() {
    return {
        text: '',
        showOption: false,
        optionPositionX: 0,
        optionPositionY: 0,
        optionPositionBottom: 0,
        searchKey: '',
        activeIndex: 0
    }
}

let AtWhoReact = React.createClass({

    getInitialState() {
        return getInitState();
    },

    propTypes: {
        flag: React.PropTypes.string,
        data: React.PropTypes.array.isRequired
    },

    _onChange(event) {
        let value = event.target.value;
        this.setState({
            text: event.target.value
        })
    },
    _onKeyDown(event) {
        if (this.state.showOption &&
            (event.keyCode == KEY_CODE.DOWN || event.keyCode == KEY_CODE.UP
            || event.keyCode == KEY_CODE.ENTER)) {
            event.preventDefault();
        }
    },

    _onKeyUp(event) {
        // TODO: 重新判断
        // 暂时强制使用@作为提示符
        if (event.keyCode === 50 && event.shiftKey) {
            // 显示候选项
            console.log('显示候选项');

            // 计算top 和 left 对应的值

            let atTargetMirror = this.refs.atTarget.getDOMNode();
            let atTargetInput = this.refs.atInput.getDOMNode();
            let atTarget = this.refs.atTarget.getDOMNode();


            if (!atTargetMirror || !atTargetInput || !atTarget) {
                return;
            }

            let $atTargetMirror = $(atTargetMirror);
            let $atTargetInput = $(atTargetInput);
            let $atTarget = $(atTarget);

            let atTargetPosition = $atTargetMirror.position();

            let rect = {
                left: atTargetPosition.left,
                top: atTargetPosition.top,
                bottom: atTargetPosition.top + $atTarget.height()
            };

            let offset = $atTargetInput.offset();

            let x = offset.left + rect.left - $atTargetInput.scrollLeft();
            let y = offset.top - $atTargetInput.scrollTop();
            let bottom = y + rect.bottom;
            y += rect.top;

            this.setState({
                showOption: true,
                optionPositionX: x,
                optionPositionY: y,
                optionPositionBottom: bottom
            });
        } else if (event.keyCode === KEY_CODE.WHITE_SPACE) {
            // 隐藏

            this.setState({
                showOption: false,
                optionPositionX: 0,
                optionPositionY: 0,
                optionPositionBottom: 0,
                searchKey: '',
                activeIndex: 0
            });

        } else if (event.keyCode == KEY_CODE.DOWN || event.keyCode == KEY_CODE.UP) {
            // 上下移动active

            event.preventDefault();

            let activeIndexOffset = event.keyCode == KEY_CODE.DOWN ? 1 : -1;


            this.setState({
                activeIndex: (this.state.activeIndex || 0) + activeIndexOffset
            })
        } else if (event.keyCode == KEY_CODE.ENTER) {
            // 将选中的option添加到文档中
            if (this.state.showOption) {
                // TODO : 暂时计算出active的option
                let optionFiltered = _.filter(this.props.data, (item)=> {
                    return item.name.indexOf(this.state.searchKey) != -1;
                });


                let activeIndex = this.state.activeIndex;
                let optionListLength = Math.max(optionFiltered.length, OPTION_LIMIT);
                while (activeIndex < 0) {
                    activeIndex += optionListLength;
                }

                let activeItem = optionFiltered[activeIndex % optionListLength];

                this.setState({
                    showOption: false,
                    optionPositionX: 0,
                    optionPositionY: 0,
                    optionPositionBottom: 0,
                    searchKey: '',
                    activeIndex: 0,
                    text: this.state.text + activeItem.name + ' '
                });


            }
        } else {
            // 做optionList的过滤

            let checkContent = /.*(@.*?)$/.exec(event.target.value);
            if (!checkContent) {
                // 隐藏
                this.setState({
                    showOption: false,
                    optionPositionX: 0,
                    optionPositionY: 0,
                    optionPositionBottom: 0,
                    searchKey: '',
                    activeIndex: 0
                });
            } else {
                let checkContentValue = checkContent[checkContent.length - 1];
                checkContentValue = checkContentValue.split(' ').reverse()[0];
                if (checkContentValue.indexOf('@') != -1) {
                    this.setState({
                        searchKey: checkContentValue.replace('@', '')
                    });
                } else {
                    this.setState({
                        showOption: false,
                        optionPositionX: 0,
                        optionPositionY: 0,
                        optionPositionBottom: 0,
                        searchKey: '',
                        activeIndex: 0
                    });
                }
            }


        }
    },


    componentDidMount() {
        // 计算部分css的值
        let atTargetInput = this.refs.atInput.getDOMNode();
        let atTargetMirror = this.refs.atMirror.getDOMNode();
        if (!atTargetInput || !atTargetMirror) {
            return;
        }

        let $atTargetInput = $(atTargetInput);
        let $atTargetMirror = $(atTargetMirror);

        $atTargetMirror.width($atTargetInput.width());
        $atTargetMirror.height($atTargetInput.height());

        let cssAttr = ["overflowY", "height", "width", "paddingTop", "paddingLeft", "paddingRight",
            "paddingBottom", "marginTop", "marginLeft", "marginRight", "marginBottom", 'fontFamily',
            'borderStyle', 'borderWidth', 'wordWrap', 'fontSize', 'lineHeight', 'overflowX'];

        let targetCss = {};

        $.each(cssAttr, (i, p)=> {
            targetCss[p] = $atTargetInput.css(p);
        });

        // 重置Mirror的css信息
        $atTargetMirror.css(targetCss);

    },


    componentDidUpdate() {
    },

    render() {


        let optionListDOM = null;
        let searchKey = this.state.searchKey;
        let activeIndex = this.state.activeIndex || 0;


        if (this.state.showOption) {
            let optionListData = this.props.data;
            let optionListFiltered = _.filter(optionListData, (item)=> {
                return item.name.indexOf(searchKey) != -1;
            });

            let optionListLength = Math.max(optionListFiltered.length, OPTION_LIMIT);
            while (activeIndex < 0) {
                activeIndex += optionListLength;
            }

            optionListDOM = _.map(optionListFiltered, (item, index)=> {

                let active = (activeIndex % optionListLength) == index;

                return (
                    <AtWhoReactTmpl key={index} name={item.name} active={active}></AtWhoReactTmpl>
                )
            })
        }

        return (
            <div>
                <div ref='atMirror' style={{
                    position: 'absolute',
                    left: -9999,
                    top: 0,
                    zIndex: -20000,
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word'
                }}>
                    <span>{this.state.text}</span>
                    <span ref='atTarget'></span>
                </div>


                <div ref='atView' style={{
                    left: this.state.optionPositionX,
                    top: this.state.optionPositionBottom,
                    display: this.state.showOption ? 'block' : 'none',
                    position: 'absolute',
                    backgroundColor: 'red'
                }}>{optionListDOM}</div>

                <textarea ref='atInput'
                    onChange={this._onChange} onKeyDown={this._onKeyDown}
                    onKeyUp={this._onKeyUp} value={this.state.text}
                    style={{height: 500, width: 900}}></textarea>
            </div>
        )
    }
});

module.exports = AtWhoReact;