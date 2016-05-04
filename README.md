# react-atwho
A React component which provide '@' features based on [at.js](https://github.com/ichord/At.js)
***note*** This component now is only tested in **chrome**


## Flag
Now only @ is supported to trigger the list, and you can use ***arrow up*** and ***arrow down*** to 
select different option and ***enter*** to choose option

## Source data
An array of data should provide for the tmpl. ***value*** should provided for each item. ***desc*** 
which will displayed in the tmpl, is also supported. ***value*** will be inserted when item is chosen.  
Here is an example of the data: 
```javascript
let testData = [{value: 'Top-Level API', desc: 'top level api'},
    {value: 'Component API'},
    {value: 'Component Specs and Lifecycle'},
    {value: 'Supported Tags and Attributes'},
    {value: 'Event System'},
    {value: 'DOM Differences'},
    {value: 'Special Non-DOM Attributes'},
    {value: 'Reconciliation'},
    {value: 'React (Virtual) DOM Terminology'}
  ];
```


## Tmpl
A given tmpl is used by default in AtWho.React.js, you can also use your own tmpl: 
```html
<div style={computedStyle} className={computedClassName}>{desc}</div>
```

## props
Available props: 
* data: source data for tmp, available type is PropTypes.array.isRequired

* style: default style for each option item, available type is PropTypes.object
    
* activeStyle: active style for selected item, available type is PropTypes.object

* className: default className for each option item, available type is PropTypes.string

* activeClassName: extra className for actived option item, available type is PropTypes.string
    
* componentItem: tmpl component, available type is PropTypes.any
    
* maxedListCount: max count of options to display, available type is PropTypes.number
    

## TODO List: 
1. Make flag configurable. 
2. add eslint 