# react-atwho
基于[at.js](https://github.com/ichord/At.js)改写的react组件, 用于类似weibo中输入@之后出现的下拉选项.

## 提示符
目前只支持@符号，可以通过向上/向下箭头选择激活状态的候选项，通过回车将选中的候选项写入到输入框中

## 数据格式
当前数据定义为一个数组，每个元素需要有name属性，如下: 
```javascript
let testData = [{name: 'Top-Level API'},
    {name: 'Component API'},
    {name: 'Component Specs and Lifecycle'},
    {name: 'Supported Tags and Attributes'},
    {name: 'Event System'},
    {name: 'DOM Differences'},
    {name: 'Special Non-DOM Attributes'},
    {name: 'Reconciliation'},
    {name: 'React (Virtual) DOM Terminology'}
  ];
```

## 模板
使用了固定的模板，在模板中添加了active状态下的特有inline style: 
```html
<li style={active ? {backgroundColor: 'green'} : {}}>{name}</li>
```

## TODO List: 
1. 提示符可配置
2. 数据格式可配置
3. 模板可配置
