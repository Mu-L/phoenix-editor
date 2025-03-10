/*
 * GNU AGPL-3.0 License
 *
 * Copyright (c) 2021 - present core.ai . All rights reserved.
 * Original work Copyright (c) 2012 - 2021 Adobe Systems Incorporated. All rights reserved.
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see https://opensource.org/licenses/AGPL-3.0.
 *
 */

// @INCLUDE_IN_API_DOCS

/*global less, Phoenix */

/**
 * The ViewCommandHandlers object dispatches the following event(s):
 *    - fontSizeChange -- Triggered when the font size is changed via the
 *      Increase Font Size, Decrease Font Size, or Restore Font Size commands.
 *      The 2nd arg to the listener is the amount of the change. The 3rd arg
 *      is a string containing the new font size after applying the change.
 */
define(function (require, exports, module) {


    var Commands            = require("command/Commands"),
        EventDispatcher     = require("utils/EventDispatcher"),
        CommandManager      = require("command/CommandManager"),
        Strings             = require("strings"),
        StringUtils         = require("utils/StringUtils"),
        EditorManager       = require("editor/EditorManager"),
        PreferencesManager  = require("preferences/PreferencesManager"),
        DocumentManager     = require("document/DocumentManager"),
        ThemeSettings       = require("view/ThemeSettings"),
        MainViewManager     = require("view/MainViewManager"),
        AppInit             = require("utils/AppInit"),
        Dialogs             = require("widgets/Dialogs"),
        DefaultDialogs      = require("widgets/DefaultDialogs"),
        KeyBindingManager   = require("command/KeyBindingManager"),
        WorkspaceManager    = require("view/WorkspaceManager"),
        _                   = require("thirdparty/lodash"),
        FontRuleTemplate    = require("text!view/fontrules/font-based-rules.less");

    var prefs = PreferencesManager.getExtensionPrefs("fonts");


    /**
     * Font sizes should be validated by this regexp
     */
    var validFontSizeRegExpStr = "^([0-9]+)?(\\.)?([0-9]+)(px|em)$";
    // Need RegExp as a string to be exported for use with HTML5 pattern attribute

    /**
     * @private
     * The currently present font size. Used to detect no-op changes.
     * @type {string}
     */
    var currFontSize;

    /**
     * @private
     * The currently present font family. Used to detect no-op changes.
     * @type {string}
     */
    var currFontFamily;

    /**
     * @const
     * @type {string}
     * @private
     */
    var DYNAMIC_FONT_STYLE_ID = "codemirror-dynamic-fonts";

    /**
     * @const
     * @type {string}
     * @private
     */
    var DYNAMIC_FONT_FAMILY_ID = "codemirror-dynamic-font-family";

    /**
     * @const
     * @private
     * The smallest font size in pixels
     * @type {number}
     */
    var MIN_FONT_SIZE = 1;

    /**
     * @const
     * @private
     * The largest font size in pixels
     * @type {number}
     */
    var MAX_FONT_SIZE = 72;

    /**
     * @const
     * @private
     * The default font size used only to convert the old fontSizeAdjustment view state to the new fontSize
     * @type {number}
     */
    var DEFAULT_FONT_SIZE = 12;

    /**
     * @const
     * @private
     * The default font family
     * @type {string}
     */
    var DEFAULT_FONT_FAMILY = "'SourceCodePro-Medium', ＭＳ ゴシック, 'MS Gothic', monospace";


    const PREF_DESKTOP_ZOOM_SCALE = "desktopZoomScale";
    const DEFAULT_ZOOM_SCALE = 1, MIN_ZOOM_SCALE = .5, MAX_ZOOM_SCALE = 2;

    /**
     * @private
     * Removes style property from the DOM
     * @param {string} propertyID is the id of the property to be removed
     */
    function _removeDynamicProperty(propertyID) {
        $("#" + propertyID).remove();
    }

    /**
     * @private
     * Add the style property to the DOM
     * @param {string} propertyID Is the property ID to be added
     * @param {object} ruleCfg Is the CSS Rule configuration object
     * @param {string} ruleCfg.propName Is the name of the style property
     * @param {string} ruleCfg.propValue Is the value of the style property
     * @param {boolean} ruleCfg.priorityFlag Is a flag to make the style property !important
     * @param {string} ruleCfg.ruleName Optional Selctor name to be used for the rule
     * @param {string} ruleCfg.ruleText Optional selector definition text
     */
    function _addDynamicProperty(propertyID, ruleCfg) {
        var $style   = $("<style type='text/css'></style>").attr("id", propertyID);
        if (ruleCfg.ruleText) {
            $style.html(ruleCfg.ruleText);
        } else {
            var cssRule = ruleCfg.ruleName || ".CodeMirror";
            var styleStr = ruleCfg.ruleText || StringUtils.format("{0}: {1} {2}", ruleCfg.propName, ruleCfg.propValue, ruleCfg.priorityFlag ? "!important" : "");
            $style.html(cssRule + "{ " + styleStr + " }");
        }

        // Let's make sure we remove the already existing item from the DOM.
        _removeDynamicProperty(propertyID);
        $("head").append($style);
    }

    /**
     * @private
     * Removes the styles used to update the font size
     */
    function _removeDynamicFontSize() {
        _removeDynamicProperty(DYNAMIC_FONT_STYLE_ID);
    }

    /**
     * @private
     * Add the styles used to update the font size
     * @param {string} fontSize  A string with the font size and the size unit
     */
    function _addDynamicFontSize(fontSize) {
        var template = FontRuleTemplate.split("{font-size-param}").join(fontSize);
        less.render(template, null, function onParse(err, tree) {
            if (err) {
                console.error(err);
            } else {
                _addDynamicProperty(DYNAMIC_FONT_STYLE_ID, {
                    ruleText: tree.css
                });
            }
        });
    }

    /**
     * @private
     * Removes the styles used to update the font family
     */
    function _removeDynamicFontFamily() {
        _removeDynamicProperty(DYNAMIC_FONT_FAMILY_ID);
    }

    /**
     * @private
     * Add the styles used to update the font family
     * @param {string} fontFamily  A string with the font family
     */
    function _addDynamicFontFamily(fontFamily) {
        _addDynamicProperty(DYNAMIC_FONT_FAMILY_ID, {
            propName: "font-family",
            propValue: fontFamily
        });
    }

    /**
     * @private
     * Sets the font size and restores the scroll position as best as possible.
     * @param {!Editor} editor  Editor to update.
     * @param {string=} fontSize  A string with the font size and the size unit
     */
    function _updateScroll(editor, fontSize) {
        var oldWidth    = editor._codeMirror.defaultCharWidth(),
            oldFontSize = prefs.get("fontSize"),
            newFontSize = fontSize,
            delta       = 0,
            adjustment  = 0,
            scrollPos   = editor.getScrollPos(),
            line        = editor._codeMirror.lineAtHeight(scrollPos.y, "local");

        delta = /em$/.test(oldFontSize) ? 10 : 1;
        adjustment = parseInt((parseFloat(newFontSize) - parseFloat(oldFontSize)) * delta, 10);

        // Only adjust the scroll position if there was any adjustments to the font size.
        // Otherwise there will be unintended scrolling.
        //
        if (adjustment) {
            editor.refreshAll();
        }

        // Calculate the new scroll based on the old font sizes and scroll position
        var newWidth   = editor._codeMirror.defaultCharWidth(),
            deltaX     = scrollPos.x / oldWidth,
            scrollPosX = scrollPos.x + Math.round(deltaX * (newWidth  - oldWidth)),
            scrollPosY = editor._codeMirror.heightAtLine(line, "local");

        editor.setScrollPos(scrollPosX, scrollPosY);
    }

    /**
     * Font size setter to set the font size for the document editor
     * @param {string} fontSize The font size with size unit as 'px' or 'em'
     */
    function setFontSize(fontSize) {
        if (currFontSize === fontSize) {
            return;
        }

        _removeDynamicFontSize();
        if (fontSize) {
            _addDynamicFontSize(fontSize);
        }

        // Update scroll metrics in viewed editors
        _.forEach(MainViewManager.getPaneIdList(), function (paneId) {
            var currentPath = MainViewManager.getCurrentlyViewedPath(paneId),
                doc = currentPath && DocumentManager.getOpenDocumentForPath(currentPath);
            if (doc && doc._masterEditor) {
                _updateScroll(doc._masterEditor, fontSize);
            }
        });

        exports.trigger("fontSizeChange", fontSize, currFontSize);
        currFontSize = fontSize;
        prefs.set("fontSize", fontSize);
    }

    /**
     * Font size getter to get the current font size for the document editor
     * @return {string} Font size with size unit as 'px' or 'em'
     */
    function getFontSize() {
        return prefs.get("fontSize");
    }


    /**
     * Font family setter to set the font family for the document editor
     * @param {string} fontFamily The font family to be set.  It can be a string with multiple comma separated fonts
     */
    function setFontFamily(fontFamily) {
        var editor = EditorManager.getCurrentFullEditor();

        if (currFontFamily === fontFamily) {
            return;
        }

        _removeDynamicFontFamily();
        if (fontFamily) {
            _addDynamicFontFamily(fontFamily);
        }

        exports.trigger("fontFamilyChange", fontFamily, currFontFamily);
        currFontFamily = fontFamily;
        prefs.set("fontFamily", fontFamily);

        if (editor) {
            editor.refreshAll();
        }
    }

    /**
     * Font family getter to get the currently configured font family for the document editor
     * @return {string} The font family for the document editor
     */
    function getFontFamily() {
        return prefs.get("fontFamily");
    }


    /**
     * @private
     * Increases or decreases the editor's font size.
     * @param {number} adjustment  Negative number to make the font smaller; positive number to make it bigger
     * @return {boolean} true if adjustment occurred, false if it did not occur
     */
    function _adjustFontSize(adjustment) {
        var fsStyle    = prefs.get("fontSize");
        var validFontSizeRegExp = new RegExp(validFontSizeRegExpStr);

        // Make sure that the font size is expressed in terms we can
        // handle (px or em). If not, simply bail.

        if (fsStyle.search(validFontSizeRegExp) === -1) {
            return false;
        }

        // Guaranteed to work by validation above.
        var fsUnits = fsStyle.substring(fsStyle.length - 2, fsStyle.length),
            delta   = fsUnits === "px" ? 1 : 0.1,
            fsOld   = parseFloat(fsStyle.substring(0, fsStyle.length - 2)),
            fsNew   = fsOld + (delta * adjustment),
            fsStr   = fsNew + fsUnits;

        // Don't let the font size get too small or too large. The minimum font size is 1px or 0.1em
        // and the maximum font size is 72px or 7.2em depending on the unit used
        if (fsNew < MIN_FONT_SIZE * delta || fsNew > MAX_FONT_SIZE * delta) {
            return false;
        }

        setFontSize(fsStr);
        return true;
    }

    /**
     * Increases the font size by 1
     * @private
     */
    function _handleIncreaseFontSize() {
        _adjustFontSize(1);
    }

    function _handleBrowserZoom(event) {
        // if we do set document.body.style=zoom = something, then the new project window or generally any iframes based
        // ui with in phcode will not be affected by zoom resulting in widely inconsistent ux on zoom.
        // Further, in Firefox, we cannot programmatically zoom, but user can zoom with Ctrl-+ or - shortcut. So
        // if user click on ui menu, all we can do is to show a dialogue asking them to press ctrl + / minus
        if(event.eventSource === CommandManager.SOURCE_KEYBOARD_SHORTCUT){
            // for keyboard shortcuts, we immediately reject so that the browser zoom kicks in that is the
            // most reliable zoom for now.
            return new $.Deferred().reject("use browser zoom");
        } else {
            const zoomInKey = KeyBindingManager.getKeyBindingsDisplay(Commands.VIEW_ZOOM_IN) || '',
                zoomOutKey = KeyBindingManager.getKeyBindingsDisplay(Commands.VIEW_ZOOM_OUT) || '';
            let message = StringUtils.format(Strings.ZOOM_WITH_SHORTCUTS_DETAILS, zoomInKey, zoomOutKey);
            Dialogs.showInfoDialog(Strings.ZOOM_WITH_SHORTCUTS, message);
            return new $.Deferred().resolve();
        }
    }

    function _handleZoomIn(event) {
        if(!Phoenix.isNativeApp) {
            return _handleBrowserZoom(event);
        }
        const currentZoom = prefs.get(PREF_DESKTOP_ZOOM_SCALE);
        if(currentZoom < MAX_ZOOM_SCALE){
            prefs.set(PREF_DESKTOP_ZOOM_SCALE, currentZoom + 0.1);
            PhStore.setItem(PhStore._PHSTORE_BOOT_DESKTOP_ZOOM_SCALE_KEY, currentZoom + 0.1);
        }
    }

    function _handleZoomOut(event) {
        if(!Phoenix.isNativeApp) {
            return _handleBrowserZoom(event);
        }
        const currentZoom = prefs.get(PREF_DESKTOP_ZOOM_SCALE);
        if(currentZoom > MIN_ZOOM_SCALE){
            prefs.set(PREF_DESKTOP_ZOOM_SCALE, currentZoom - 0.1);
            PhStore.setItem(PhStore._PHSTORE_BOOT_DESKTOP_ZOOM_SCALE_KEY, currentZoom - 0.1);
        }
    }

    /**
     * Decreases the font size by 1
     * @private
     */
    function _handleDecreaseFontSize() {
        _adjustFontSize(-1);
    }

    /**
     * Restores the font size to the original size
     * @private
     */
    function _handleRestoreFontSize() {
        setFontSize(DEFAULT_FONT_SIZE + "px");
    }

    /**
     * @private
     * Updates the user interface appropriately based on whether or not a document is
     * currently open in the editor.
     */
    function _updateUI() {
        if (DocumentManager.getCurrentDocument() !== null) {
            if (!CommandManager.get(Commands.VIEW_INCREASE_FONT_SIZE).getEnabled()) {
                // If one is disabled then they all are disabled, so enable them all
                CommandManager.get(Commands.VIEW_INCREASE_FONT_SIZE).setEnabled(true);
                CommandManager.get(Commands.VIEW_DECREASE_FONT_SIZE).setEnabled(true);
                CommandManager.get(Commands.VIEW_RESTORE_FONT_SIZE).setEnabled(true);
            }
        } else {
            // No current document so disable all of the Font Size commands
            CommandManager.get(Commands.VIEW_INCREASE_FONT_SIZE).setEnabled(false);
            CommandManager.get(Commands.VIEW_DECREASE_FONT_SIZE).setEnabled(false);
            CommandManager.get(Commands.VIEW_RESTORE_FONT_SIZE).setEnabled(false);
        }
    }

    /**
     * Initializes the different settings that need to loaded
     * @private
     */
    function init() {
        currFontFamily = prefs.get("fontFamily");
        _addDynamicFontFamily(currFontFamily);
        currFontSize = prefs.get("fontSize");
        _addDynamicFontSize(currFontSize);
        _updateUI();
    }

    /**
     * Restores the font size using the saved style and migrates the old fontSizeAdjustment
     * view state to the new fontSize, when required
     */
    function restoreFontSize() {
        var fsStyle      = prefs.get("fontSize"),
            fsAdjustment = PreferencesManager.getViewState("fontSizeAdjustment");

        if (fsAdjustment) {
            // Always remove the old view state even if we also have the new view state.
            PreferencesManager.setViewState("fontSizeAdjustment");

            if (!fsStyle) {
                // Migrate the old view state to the new one.
                fsStyle = (DEFAULT_FONT_SIZE + fsAdjustment) + "px";
                prefs.set("fontSize", fsStyle);
            }
        }

        if (fsStyle) {
            _removeDynamicFontSize();
            _addDynamicFontSize(fsStyle);
        }
    }

    /**
     * Restores the font size and font family back to factory settings.
     */
    function restoreFonts() {
        setFontFamily(DEFAULT_FONT_FAMILY);
        setFontSize(DEFAULT_FONT_SIZE + "px");
    }


    /**
     * @private
     * Calculates the first and last visible lines of the focused editor
     * @param {number} textHeight
     * @param {number} scrollTop
     * @param {number} editorHeight
     * @return {{first: number, last: number}}
     */
    function _getLinesInView(textHeight, scrollTop, editorHeight) {
        var scrolledTop    = scrollTop / textHeight,
            scrolledBottom = (scrollTop + editorHeight) / textHeight;

        // Adjust the last line to round inward to show a whole lines.
        var firstLine      = Math.ceil(scrolledTop),
            lastLine       = Math.floor(scrolledBottom) - 1;

        return { first: firstLine, last: lastLine };
    }

    /**
     * @private
     * Scroll the viewport one line up or down.
     * @param {number} direction -1 to scroll one line up; 1 to scroll one line down.
     */
    function _scrollLine(direction) {
        var editor        = EditorManager.getCurrentFullEditor(),
            textHeight    = editor.getTextHeight(),
            cursorPos     = editor.getCursorPos(),
            hasSelecction = editor.hasSelection(),
            inlineEditors = editor.getInlineWidgets(),
            scrollInfo    = editor._codeMirror.getScrollInfo(),
            paddingTop    = editor._getLineSpaceElement().offsetTop,
            editorHeight  = scrollInfo.clientHeight,
            scrollTop     = scrollInfo.top - paddingTop,
            removedScroll = paddingTop;

        // Go through all the editors and reduce the scroll top and editor height to properly calculate the lines in view
        var line, coords;
        inlineEditors.forEach(function (inlineEditor) {
            line   = editor._getInlineWidgetLineNumber(inlineEditor);
            coords = editor._codeMirror.charCoords({line: line, ch: 0}, "local");

            if (coords.top < scrollInfo.top) {
                scrollTop     -= inlineEditor.info.height;
                removedScroll += inlineEditor.info.height;

            } else if (coords.top + inlineEditor.info.height < scrollInfo.top + editorHeight) {
                editorHeight -= inlineEditor.info.height;
            }
        });

        // Calculate the lines in view
        var linesInView = _getLinesInView(textHeight, scrollTop, editorHeight);

        // If there is no selection move the cursor so that is always visible.
        if (!hasSelecction) {
            // Move the cursor to the first visible line.
            if (cursorPos.line < linesInView.first) {
                editor.setCursorPos({line: linesInView.first + direction, ch: cursorPos.ch});

            // Move the cursor to the last visible line.
            } else if (cursorPos.line > linesInView.last) {
                editor.setCursorPos({line: linesInView.last + direction, ch: cursorPos.ch});

            // Move the cursor up or down using moveV to keep the goal column intact, since setCursorPos deletes it.
            } else if ((direction > 0 && cursorPos.line === linesInView.first) ||
                    (direction < 0 && cursorPos.line === linesInView.last)) {
                editor._codeMirror.moveV(direction, "line");
            }
        }

        // Scroll and make it snap to lines
        var lines = linesInView.first + direction;
        editor.setScrollPos(scrollInfo.left, (textHeight * lines) + removedScroll);
    }

    /**
     * Scrolls one line up
     * @private
     */
    function _handleScrollLineUp() {
        _scrollLine(-1);
    }

    /**
     * Scrolls one line down
     * @private
     */
    function _handleScrollLineDown() {
        _scrollLine(1);
    }

    /**
     * Open theme settings dialog
     * @private
     */
    function _handleThemeSettings() {
        ThemeSettings.showDialog();
    }

    // Register command handlers
    CommandManager.register(Strings.CMD_INCREASE_FONT_SIZE, Commands.VIEW_INCREASE_FONT_SIZE,  _handleIncreaseFontSize);
    CommandManager.register(Strings.CMD_DECREASE_FONT_SIZE, Commands.VIEW_DECREASE_FONT_SIZE,  _handleDecreaseFontSize);
    CommandManager.register(Strings.CMD_ZOOM_IN, Commands.VIEW_ZOOM_IN,  _handleZoomIn, {eventSource: true});
    CommandManager.register(Strings.CMD_ZOOM_OUT, Commands.VIEW_ZOOM_OUT,  _handleZoomOut, {eventSource: true});
    CommandManager.register(Strings.CMD_RESTORE_FONT_SIZE,  Commands.VIEW_RESTORE_FONT_SIZE,   _handleRestoreFontSize);
    CommandManager.register(Strings.CMD_SCROLL_LINE_UP,     Commands.VIEW_SCROLL_LINE_UP,      _handleScrollLineUp);
    CommandManager.register(Strings.CMD_SCROLL_LINE_DOWN,   Commands.VIEW_SCROLL_LINE_DOWN,    _handleScrollLineDown);
    CommandManager.register(Strings.CMD_THEMES,             Commands.CMD_THEMES_OPEN_SETTINGS, _handleThemeSettings);

    prefs.definePreference("fontSize",   "string", DEFAULT_FONT_SIZE + "px", {
        description: Strings.DESCRIPTION_FONT_SIZE
    }).on("change", function () {
        setFontSize(prefs.get("fontSize"));
    });
    prefs.definePreference("fontFamily", "string", DEFAULT_FONT_FAMILY, {
        description: Strings.DESCRIPTION_FONT_FAMILY
    }).on("change", function () {
        setFontFamily(prefs.get("fontFamily"));
    });

    prefs.definePreference(PREF_DESKTOP_ZOOM_SCALE, "number", DEFAULT_ZOOM_SCALE, {
        description: Strings.DESCRIPTION_DESKTOP_ZOOM_SCALE
    }).on("change", function () {
        if(Phoenix.isNativeApp) {
            const zoomFactor = prefs.get(PREF_DESKTOP_ZOOM_SCALE);
            PhStore.setItem(PhStore._PHSTORE_BOOT_DESKTOP_ZOOM_SCALE_KEY, zoomFactor);
            if(zoomFactor < MIN_ZOOM_SCALE || zoomFactor > MAX_ZOOM_SCALE) {
                console.error(
                    `Zoom scale should be between ${MIN_ZOOM_SCALE} and ${MAX_ZOOM_SCALE} but got ${zoomFactor}!`);
                return;
            }
            brackets.app.zoomWebView(zoomFactor);
            const zoomIn = CommandManager.get(Commands.VIEW_ZOOM_IN);
            const zoomString = StringUtils.format(Strings.CMD_ZOOM_IN_SCALE, Math.round(zoomFactor*100));
            zoomIn.setName(zoomString);
        }
    });

    // Update UI when opening or closing a document
    MainViewManager.on("currentFileChange", _updateUI);

    // Update UI when Brackets finishes loading
    AppInit.appReady(init);

    EventDispatcher.makeEventDispatcher(exports);

    exports.restoreFontSize = restoreFontSize;
    exports.restoreFonts    = restoreFonts;
    exports.getFontSize     = getFontSize;
    exports.setFontSize     = setFontSize;
    exports.getFontFamily   = getFontFamily;
    exports.setFontFamily   = setFontFamily;
    exports.validFontSizeRegExp = validFontSizeRegExpStr;
});
