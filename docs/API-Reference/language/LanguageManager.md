### Import :
```js
const LanguageManager = brackets.getModule("language/LanguageManager")
```

<a name="Language"></a>

## Language
**Kind**: global class  

* [Language](#Language)
    * [new Language()](#new_Language_new)
    * [._id](#Language+_id) : <code>string</code>
    * [._name](#Language+_name) : <code>string</code>
    * [._mode](#Language+_mode) : <code>string</code>
    * [._fileExtensions](#Language+_fileExtensions) : <code>Array.&lt;string&gt;</code>
    * [._fileNames](#Language+_fileNames) : <code>Array.&lt;string&gt;</code>
    * [._lineCommentSyntax](#Language+_lineCommentSyntax) : <code>Array.&lt;string&gt;</code>
    * [._modeToLanguageMap](#Language+_modeToLanguageMap) : <code>Object.&lt;string, Language&gt;</code>
    * [._blockCommentSyntax](#Language+_blockCommentSyntax) : <code>Object</code>
    * [._isBinary](#Language+_isBinary) : <code>boolean</code>
    * [.getId()](#Language+getId) ⇒ <code>string</code>
    * [._setId(id)](#Language+_setId) ⇒ <code>boolean</code>
    * [.getName()](#Language+getName) ⇒ <code>string</code>
    * [._setName(name)](#Language+_setName) ⇒ <code>boolean</code>
    * [.getMode()](#Language+getMode) ⇒ <code>string</code>
    * [._loadAndSetMode(mode)](#Language+_loadAndSetMode) ⇒ <code>$.Promise</code>
    * [.getFileExtensions()](#Language+getFileExtensions) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getFileNames()](#Language+getFileNames) ⇒ <code>Array.&lt;string&gt;</code>
    * [.addFileExtension(extension)](#Language+addFileExtension)
    * [.removeFileExtension(extension)](#Language+removeFileExtension)
    * [.addFileName(extension)](#Language+addFileName)
    * [.removeFileName(extension)](#Language+removeFileName)
    * [.hasLineCommentSyntax()](#Language+hasLineCommentSyntax) ⇒ <code>boolean</code>
    * [.getLineCommentPrefixes()](#Language+getLineCommentPrefixes) ⇒ <code>Array.&lt;string&gt;</code>
    * [.setLineCommentSyntax(prefix)](#Language+setLineCommentSyntax) ⇒ <code>boolean</code>
    * [.hasBlockCommentSyntax()](#Language+hasBlockCommentSyntax) ⇒ <code>boolean</code>
    * [.getBlockCommentPrefix()](#Language+getBlockCommentPrefix) ⇒ <code>string</code>
    * [.getBlockCommentSuffix()](#Language+getBlockCommentSuffix) ⇒ <code>string</code>
    * [.setBlockCommentSyntax(prefix, suffix)](#Language+setBlockCommentSyntax) ⇒ <code>boolean</code>
    * [.getLanguageForMode(mode)](#Language+getLanguageForMode) ⇒ [<code>Language</code>](#Language)
    * [.isFallbackLanguage()](#Language+isFallbackLanguage) ⇒ <code>boolean</code>
    * [.isBinary()](#Language+isBinary) ⇒ <code>boolean</code>
    * [._setBinary(isBinary)](#Language+_setBinary)

<a name="new_Language_new"></a>

### new Language()
Model for a language.

<a name="Language+_id"></a>

### language.\_id : <code>string</code>
Identifier for this language

**Kind**: instance property of [<code>Language</code>](#Language)  
<a name="Language+_name"></a>

### language.\_name : <code>string</code>
Human-readable name of this language

**Kind**: instance property of [<code>Language</code>](#Language)  
<a name="Language+_mode"></a>

### language.\_mode : <code>string</code>
CodeMirror mode for this language

**Kind**: instance property of [<code>Language</code>](#Language)  
<a name="Language+_fileExtensions"></a>

### language.\_fileExtensions : <code>Array.&lt;string&gt;</code>
File extensions that use this language

**Kind**: instance property of [<code>Language</code>](#Language)  
<a name="Language+_fileNames"></a>

### language.\_fileNames : <code>Array.&lt;string&gt;</code>
File names for extensionless files that use this language

**Kind**: instance property of [<code>Language</code>](#Language)  
<a name="Language+_lineCommentSyntax"></a>

### language.\_lineCommentSyntax : <code>Array.&lt;string&gt;</code>
Line comment syntax

**Kind**: instance property of [<code>Language</code>](#Language)  
<a name="Language+_modeToLanguageMap"></a>

### language.\_modeToLanguageMap : <code>Object.&lt;string, Language&gt;</code>
Which language to use for what CodeMirror mode

**Kind**: instance property of [<code>Language</code>](#Language)  
<a name="Language+_blockCommentSyntax"></a>

### language.\_blockCommentSyntax : <code>Object</code>
Block comment syntax

**Kind**: instance property of [<code>Language</code>](#Language)  
<a name="Language+_isBinary"></a>

### language.\_isBinary : <code>boolean</code>
Whether or not the language is binary

**Kind**: instance property of [<code>Language</code>](#Language)  
<a name="Language+getId"></a>

### language.getId() ⇒ <code>string</code>
Returns the identifier for this language.

**Kind**: instance method of [<code>Language</code>](#Language)  
**Returns**: <code>string</code> - The identifier  
<a name="Language+_setId"></a>

### language.\_setId(id) ⇒ <code>boolean</code>
Sets the identifier for this language or prints an error to the console.

**Kind**: instance method of [<code>Language</code>](#Language)  
**Returns**: <code>boolean</code> - Whether the ID was valid and set or not  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Identifier for this language: lowercase letters, digits, and _ separators (e.g. "cpp", "foo_bar", "c99") |

<a name="Language+getName"></a>

### language.getName() ⇒ <code>string</code>
Returns the human-readable name of this language.

**Kind**: instance method of [<code>Language</code>](#Language)  
**Returns**: <code>string</code> - The name  
<a name="Language+_setName"></a>

### language.\_setName(name) ⇒ <code>boolean</code>
Sets the human-readable name of this language or prints an error to the console.

**Kind**: instance method of [<code>Language</code>](#Language)  
**Returns**: <code>boolean</code> - Whether the name was valid and set or not  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Human-readable name of the language, as it's commonly referred to (e.g. "C++") |

<a name="Language+getMode"></a>

### language.getMode() ⇒ <code>string</code>
Returns the CodeMirror mode for this language.

**Kind**: instance method of [<code>Language</code>](#Language)  
**Returns**: <code>string</code> - The mode  
<a name="Language+_loadAndSetMode"></a>

### language.\_loadAndSetMode(mode) ⇒ <code>$.Promise</code>
Loads a mode and sets it for this language.

**Kind**: instance method of [<code>Language</code>](#Language)  
**Returns**: <code>$.Promise</code> - A promise object that will be resolved when the mode is loaded and set  

| Param | Type | Description |
| --- | --- | --- |
| mode | <code>string</code> \| <code>Array.&lt;string&gt;</code> | CodeMirror mode (e.g. "htmlmixed"), optionally paired with a MIME mode defined by      that mode (e.g. ["clike", "text/x-c++src"]). Unless the mode is located in thirdparty/CodeMirror/mode/"name"/"name".js,      you need to first load it yourself. |

<a name="Language+getFileExtensions"></a>

### language.getFileExtensions() ⇒ <code>Array.&lt;string&gt;</code>
Returns an array of file extensions for this language.

**Kind**: instance method of [<code>Language</code>](#Language)  
**Returns**: <code>Array.&lt;string&gt;</code> - File extensions used by this language  
<a name="Language+getFileNames"></a>

### language.getFileNames() ⇒ <code>Array.&lt;string&gt;</code>
Returns an array of file names for extensionless files that use this language.

**Kind**: instance method of [<code>Language</code>](#Language)  
**Returns**: <code>Array.&lt;string&gt;</code> - Extensionless file names used by this language  
<a name="Language+addFileExtension"></a>

### language.addFileExtension(extension)
Adds one or more file extensions to this language.

**Kind**: instance method of [<code>Language</code>](#Language)  

| Param | Type | Description |
| --- | --- | --- |
| extension | <code>string</code> \| <code>Array.&lt;string&gt;</code> | A file extension (or array thereof) used by this language |

<a name="Language+removeFileExtension"></a>

### language.removeFileExtension(extension)
Unregisters one or more file extensions from this language.

**Kind**: instance method of [<code>Language</code>](#Language)  

| Param | Type | Description |
| --- | --- | --- |
| extension | <code>string</code> \| <code>Array.&lt;string&gt;</code> | File extension (or array thereof) to stop using for this language |

<a name="Language+addFileName"></a>

### language.addFileName(extension)
Adds one or more file names to the language which is used to match files that don't have extensions like "Makefile" for example.

**Kind**: instance method of [<code>Language</code>](#Language)  

| Param | Type | Description |
| --- | --- | --- |
| extension | <code>string</code> \| <code>Array.&lt;string&gt;</code> | An extensionless file name (or array thereof) used by this language |

<a name="Language+removeFileName"></a>

### language.removeFileName(extension)
Unregisters one or more file names from this language.

**Kind**: instance method of [<code>Language</code>](#Language)  

| Param | Type | Description |
| --- | --- | --- |
| extension | <code>string</code> \| <code>Array.&lt;string&gt;</code> | An extensionless file name (or array thereof) used by this language |

<a name="Language+hasLineCommentSyntax"></a>

### language.hasLineCommentSyntax() ⇒ <code>boolean</code>
Returns whether the line comment syntax is defined for this language.

**Kind**: instance method of [<code>Language</code>](#Language)  
**Returns**: <code>boolean</code> - Whether line comments are supported  
<a name="Language+getLineCommentPrefixes"></a>

### language.getLineCommentPrefixes() ⇒ <code>Array.&lt;string&gt;</code>
Returns an array of prefixes to use for line comments.

**Kind**: instance method of [<code>Language</code>](#Language)  
**Returns**: <code>Array.&lt;string&gt;</code> - The prefixes  
<a name="Language+setLineCommentSyntax"></a>

### language.setLineCommentSyntax(prefix) ⇒ <code>boolean</code>
Sets the prefixes to use for line comments in this language or prints an error to the console.

**Kind**: instance method of [<code>Language</code>](#Language)  
**Returns**: <code>boolean</code> - Whether the syntax was valid and set or not  

| Param | Type | Description |
| --- | --- | --- |
| prefix | <code>string</code> \| <code>Array.&lt;string&gt;</code> | Prefix string or an array of prefix strings   to use for line comments (e.g. "//" or ["//", "#"]) |

<a name="Language+hasBlockCommentSyntax"></a>

### language.hasBlockCommentSyntax() ⇒ <code>boolean</code>
Returns whether the block comment syntax is defined for this language.

**Kind**: instance method of [<code>Language</code>](#Language)  
**Returns**: <code>boolean</code> - Whether block comments are supported  
<a name="Language+getBlockCommentPrefix"></a>

### language.getBlockCommentPrefix() ⇒ <code>string</code>
Returns the prefix to use for block comments.

**Kind**: instance method of [<code>Language</code>](#Language)  
**Returns**: <code>string</code> - The prefix  
<a name="Language+getBlockCommentSuffix"></a>

### language.getBlockCommentSuffix() ⇒ <code>string</code>
Returns the suffix to use for block comments.

**Kind**: instance method of [<code>Language</code>](#Language)  
**Returns**: <code>string</code> - The suffix  
<a name="Language+setBlockCommentSyntax"></a>

### language.setBlockCommentSyntax(prefix, suffix) ⇒ <code>boolean</code>
Sets the prefix and suffix to use for blocks comments in this language or prints an error to the console.

**Kind**: instance method of [<code>Language</code>](#Language)  
**Returns**: <code>boolean</code> - Whether the syntax was valid and set or not  

| Param | Type | Description |
| --- | --- | --- |
| prefix | <code>string</code> | Prefix string to use for block comments (e.g. "< !--") |
| suffix | <code>string</code> | Suffix string to use for block comments (e.g. "-->") |

<a name="Language+getLanguageForMode"></a>

### language.getLanguageForMode(mode) ⇒ [<code>Language</code>](#Language)
Returns either a language associated with the mode or the fallback language.

**Kind**: instance method of [<code>Language</code>](#Language)  
**Returns**: [<code>Language</code>](#Language) - This language if it uses the mode, or whatever [#_getLanguageForMode](#_getLanguageForMode) returns  

| Param | Type | Description |
| --- | --- | --- |
| mode | <code>string</code> | The mode to associate the language with |

<a name="Language+isFallbackLanguage"></a>

### language.isFallbackLanguage() ⇒ <code>boolean</code>
Determines whether this is the fallback language or not

**Kind**: instance method of [<code>Language</code>](#Language)  
**Returns**: <code>boolean</code> - True if this is the fallback language, false otherwise  
<a name="Language+isBinary"></a>

### language.isBinary() ⇒ <code>boolean</code>
Indicates whether or not the language is binary (e.g., image or audio).

**Kind**: instance method of [<code>Language</code>](#Language)  
<a name="Language+_setBinary"></a>

### language.\_setBinary(isBinary)
Sets whether or not the language is binary

**Kind**: instance method of [<code>Language</code>](#Language)  

| Param | Type |
| --- | --- |
| isBinary | <code>boolean</code> | 

<a name="_validateNonEmptyString"></a>

## \_validateNonEmptyString(value, description, deferred) ⇒ <code>boolean</code>
Checks whether value is a non-empty string. Reports an error otherwise.

**Kind**: global function  
**Returns**: <code>boolean</code> - True if the value is a non-empty string, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to validate |
| description | <code>string</code> | A helpful identifier for value |
| deferred | <code>jQuery.Deferred</code> | A deferred to reject with the error message in case of an error |

<a name="_patchCodeMirror"></a>

## \_patchCodeMirror()
Monkey-patch CodeMirror to prevent modes from being overwritten by extensions.

**Kind**: global function  
<a name="_setLanguageForMode"></a>

## \_setLanguageForMode(mode, language)
Adds a global mode-to-language association.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| mode | <code>string</code> | The mode to associate the language with |
| language | [<code>Language</code>](#Language) | The language to associate with the mode |

<a name="getLanguage"></a>

## getLanguage(id) ⇒ [<code>Language</code>](#Language)
Resolves a language ID to a Language object.

**Kind**: global function  
**Returns**: [<code>Language</code>](#Language) - The language with the provided identifier or undefined  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Identifier for this language: lowercase letters, digits, and _ separators (e.g. "cpp", "foo_bar", "c99") |

<a name="getLanguageForExtension"></a>

## getLanguageForExtension(extension) ⇒ [<code>Language</code>](#Language)
Resolves a file extension to a Language object.

**Kind**: global function  
**Returns**: [<code>Language</code>](#Language) - The language for the provided extension or null if none exists  

| Param | Type | Description |
| --- | --- | --- |
| extension | <code>string</code> | Extension that language should be resolved for |

<a name="getLanguageForPath"></a>

## getLanguageForPath(path, [ignoreOverride]) ⇒ [<code>Language</code>](#Language)
Resolves a file path to a Language object.

**Kind**: global function  
**Returns**: [<code>Language</code>](#Language) - The language for the provided file type or the fallback language  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to the file to find a language for |
| [ignoreOverride] | <code>boolean</code> | If set to true will cause the lookup to ignore any      overrides and return default binding. By default override is not ignored. |

<a name="getLanguages"></a>

## getLanguages() ⇒ <code>Object.&lt;string, Language&gt;</code>
Returns a map of all the languages currently defined in the LanguageManager. The key to

**Kind**: global function  
**Returns**: <code>Object.&lt;string, Language&gt;</code> - A map containing all of the
<a name="_getLanguageForMode"></a>

## \_getLanguageForMode(mode) ⇒ [<code>Language</code>](#Language)
Resolves a CodeMirror mode to a Language object.

**Kind**: global function  
**Returns**: [<code>Language</code>](#Language) - The language for the provided mode or the fallback language  

| Param | Type | Description |
| --- | --- | --- |
| mode | <code>string</code> | CodeMirror mode |

<a name="setLanguageOverrideForPath"></a>

## setLanguageOverrideForPath(fullPath, language)
Adds a language mapping for the specified fullPath. If language is falsy (null or undefined), the mapping

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| fullPath | <code>fullPath</code> | absolute path of the file |
| language | <code>object</code> | language to associate the file with or falsy value to remove any existing override |

<a name="_resetPathLanguageOverrides"></a>

## \_resetPathLanguageOverrides()
Resets all the language overrides for file paths. Used by unit tests only.

**Kind**: global function  
<a name="getCompoundFileExtension"></a>

## getCompoundFileExtension(fullPath) ⇒ <code>string</code>
Get the file extension (excluding ".") given a path OR a bare filename.

**Kind**: global function  
**Returns**: <code>string</code> - Returns the extension of a filename or empty string if

| Param | Type | Description |
| --- | --- | --- |
| fullPath | <code>string</code> | full path to a file or directory |

<a name="defineLanguage"></a>

## defineLanguage(id, definition) ⇒ <code>$.Promise</code>
Defines a language.

**Kind**: global function  
**Returns**: <code>$.Promise</code> - A promise object that will be resolved with a Language object  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Unique identifier for this language: lowercase letters, digits, and _ separators (e.g. "cpp", "foo_bar", "c99") |
| definition | <code>Object</code> | An object describing the language |
| definition.name | <code>string</code> | Human-readable name of the language, as it's commonly referred to (e.g. "C++") |
| definition.fileExtensions | <code>Array.&lt;string&gt;</code> | List of file extensions used by this language (e.g. ["php", "php3"] or ["coffee.md"] - may contain dots) |
| definition.fileNames | <code>Array.&lt;string&gt;</code> | List of exact file names (e.g. ["Makefile"] or ["package.json]). Higher precedence than file extension. |
| definition.blockComment | <code>Array.&lt;string&gt;</code> | Array with two entries defining the block comment prefix and suffix (e.g. ["< !--", "-->"]) |
| definition.lineComment | <code>string</code> \| <code>Array.&lt;string&gt;</code> | Line comment prefixes (e.g. "//" or ["//", "#"]) |
| definition.mode | <code>string</code> \| <code>Array.&lt;string&gt;</code> | CodeMirror mode (e.g. "htmlmixed"), optionally with a MIME mode defined by that mode ["clike", "text/x-c++src"]                                                          Unless the mode is located in thirdparty/CodeMirror/mode/"name"/"name".js, you need to first load it yourself. |
