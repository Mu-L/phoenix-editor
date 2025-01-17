### Import :
```js
const PopUpManager = brackets.getModule("widgets/PopUpManager")
```

<a name="AppInit"></a>

## AppInit
Utilities for managing pop-ups.

**Kind**: global variable  
<a name="addPopUp"></a>

## addPopUp($popUp, removeHandler, autoRemove, options)
Add Esc key handling for a popup DOM element.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| $popUp | <code>jQuery</code> | jQuery object for the DOM element pop-up |
| removeHandler | <code>function</code> | Pop-up specific remove (e.g. display:none or DOM removal) |
| autoRemove | <code>Boolean</code> | Specify true to indicate the PopUpManager should      remove the popup from the _popUps array when the popup is closed. Specify false      when the popup is always persistant in the _popUps array. |
| options | <code>object</code> |  |
| [options.popupManagesFocus] | <code>boolean</code> | set to true if the popup manages focus restore on close |
| [options.closeCurrentPopups] | <code>boolean</code> | set to true if you want to dismiss all exiting popups before              adding this. Useful when this should be the only popup visible. |

<a name="removePopUp"></a>

## removePopUp($popUp)
Remove Esc key handling for a pop-up. Removes the pop-up from the DOMif the pop-up is currently visible and was not originally attached.

**Kind**: global function  

| Param | Type |
| --- | --- |
| $popUp | <code>jQuery</code> | 

<a name="_filterDropdown"></a>

## \_filterDropdown($popup, searchString)
hides all elements in popup that doesn't match the given search string, also shows the search bar in popup

**Kind**: global function  

| Param |
| --- |
| $popup | 
| searchString | 

<a name="selectNextItem"></a>

## selectNextItem(direction, $popUp)
Selects the next or previous item in the popup.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| direction | <code>number</code> | +1 for next, -1 for prev |
| $popUp |  |  |

<a name="listenToContextMenu"></a>

## listenToContextMenu(contextMenu)
Context menus are also created in AppInit.htmlReady(), so they may notyet have been created when we get our AppInit.htmlReady() callback, sowe provide this method to tell us when to start listening for their events

**Kind**: global function  

| Param | Type |
| --- | --- |
| contextMenu | <code>ContextMenu</code> | 

