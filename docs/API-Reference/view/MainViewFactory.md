### Import :
```js
const MainViewFactory = brackets.getModule("view/MainViewFactory")
```

<a name="_"></a>

## \_
MainViewFactory is a singleton for managing view factories.

**Kind**: global variable  
<a name="registerViewFactory"></a>

## registerViewFactory(factory)
Registers a view factory

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| factory | [<code>Factory</code>](#Factory) | The view factory to register. |

<a name="findSuitableFactoryForPath"></a>

## findSuitableFactoryForPath(fullPath) ⇒ [<code>Factory</code>](#Factory)
Finds a factory that can open the specified file

**Kind**: global function  
**Returns**: [<code>Factory</code>](#Factory) - A factory that can create a view for the path or undefined if there isn't one.  

| Param | Type | Description |
| --- | --- | --- |
| fullPath | <code>string</code> | The file to open. |

<a name="Factory"></a>

## Factory : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| canOpenFile | <code>function</code> | Checks if the factory can open the file by its path. |
| openFile | <code>function</code> | Function to open the file and return a promise. |
