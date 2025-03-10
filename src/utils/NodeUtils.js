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

/**
 * Generic node util APIs connector. see `src-node/utils.js` for node peer
 */

define(function (require, exports, module) {
    const Strings             = require("strings"),
        NodeConnector = require('NodeConnector');
    const UTILS_NODE_CONNECTOR = "ph_utils";

    let utilsConnector;
    if(Phoenix.isNativeApp) {
        // node not available in browser builds!
        utilsConnector = NodeConnector.createNodeConnector(UTILS_NODE_CONNECTOR, exports);
    }

    /**
     * Fetches text content from a URL
     * This is only available in the native app
     *
     * @param {string} url
     * @param {string} encoding
     * @return {Promise<string>}
     */
    async function fetchURLText(url, encoding) {
        if(!Phoenix.isNativeApp) {
            throw new Error("node not available in browser");
        }
        const {buffer} = await utilsConnector.execPeer("getURLContent", {url});
        return iconv.decode(Buffer.from(buffer), encoding);
    }

    /**
     * updates the localized strings in brackets `Strings` to node.
     *
     * @private
     * @return {Promise<boolean>} Promise resolves to true if strings was updated in node, else false(in browser.)
     */
    async function _updateNodeLocaleStrings() {
        if(!Phoenix.isNativeApp) {
            // this does nothing in browser builds.
            return false;
        }
        await utilsConnector.execPeer("setLocaleStrings", Strings);
        return true;
    }

    /**
     * Gets the version of the Phoenix binary
     * This is only available in the native app
     *
     * @return {Promise<string>}
     */
    async function getPhoenixBinaryVersion() {
        if(!Phoenix.isNativeApp) {
            throw new Error("getPhoenixBinaryVersion not available in browser");
        }
        const cliArgs = await window.__TAURI__.invoke('_get_commandline_args');
        const phoenixBinPath = cliArgs[0];
        return utilsConnector.execPeer("getPhoenixBinaryVersion", phoenixBinPath);
    }

    /**
     * Retrieves the Linux OS flavor name
     * This is only available in the native app on Linux
     *
     * @return {Promise<string|null>}
     */
    async function getLinuxOSFlavorName() {
        if(Phoenix.platform !== "linux" || !Phoenix.isNativeApp) {
            return null;
        }
        return utilsConnector.execPeer("getLinuxOSFlavorName");
    }

    /**
     * Opens a URL in the default browser.
     * This is only available in the native app.
     *
     * @param {string} url
     * @param {string} browserName
     */
    async function openUrlInBrowser(url, browserName) {
        if(!Phoenix.isNativeApp) {
            throw new Error("openUrlInBrowser not available in browser");
        }
        if(Phoenix.platform === "win") {
            return Phoenix.app._openUrlInBrowserWin(url, browserName);
        }
        return utilsConnector.execPeer("openUrlInBrowser", {url, browserName});
    }

    async function _loadNodeExtensionModule(moduleNativeDir) {
        if(!Phoenix.isNativeApp) {
            throw new Error("_loadNodeExtensionModule not available in browser");
        }
        return utilsConnector.execPeer("_loadNodeExtensionModule", {moduleNativeDir});
    }

    async function _npmInstallInFolder(moduleNativeDir) {
        if(!Phoenix.isNativeApp) {
            throw new Error("_npmInstallInFolder not available in browser");
        }
        return utilsConnector.execPeer("_npmInstallInFolder", {moduleNativeDir});
    }

    /**
     * Gets an environment variable's value
     * This is only available in the native app
     *
     * @param {string} varName
     * @return {Promise<string>}
     */
    async function getEnvironmentVariable(varName) {
        if(!Phoenix.isNativeApp) {
            throw new Error("getEnvironmentVariable not available in browser");
        }
        return utilsConnector.execPeer("getEnvironmentVariable", varName);
    }

    /**
     * Runs ESLint on a file
     * This is only available in the native app
     *
     * @param {string} text
     * @param {string} fullFilePath
     * @param {string} projectFullPath
     */
    async function ESLintFile(text, fullFilePath, projectFullPath) {
        if(!Phoenix.isNativeApp) {
            throw new Error("ESLintFile not available in browser");
        }
        return utilsConnector.execPeer("ESLintFile", {
            text,
            fullFilePath: window.fs.getTauriPlatformPath(fullFilePath),
            projectFullPath: window.fs.getTauriPlatformPath(projectFullPath)
        });
    }

    /**
     * Runs ESLint on a file
     * This is only available in the native app
     *
     * @param {string} cwd the working directory of terminal
     * @param {boolean} [usePowerShell]
     */
    async function openNativeTerminal(cwd, usePowerShell = false) {
        if(!Phoenix.isNativeApp) {
            throw new Error("openNativeTerminal not available in browser");
        }
        return utilsConnector.execPeer("openNativeTerminal", {
            cwd: window.fs.getTauriPlatformPath(cwd),
            usePowerShell
        });
    }

    /**
     * Opens a file in the default application for its type on Windows, macOS, and Linux.
     *
     * @param {string} fullPath - The path to the file/folder to open.
     * @returns {Promise<void>} - Resolves if the file/folder is opened successfully, rejects otherwise.
     */
    async function openInDefaultApp(fullPath) {
        if(!Phoenix.isNativeApp) {
            throw new Error("openInDefaultApp not available in browser");
        }
        return utilsConnector.execPeer("openInDefaultApp", window.fs.getTauriPlatformPath(fullPath));
    }

    if(NodeConnector.isNodeAvailable()) {
        // todo we need to update the strings if a user extension adds its translations. Since we dont support
        // node extensions for now, should consider when we support node extensions.
        _updateNodeLocaleStrings();
    }

    try {
        if(Phoenix.isTestWindow) {
            if(Phoenix.isNativeApp) {
                async function _setIsTestWindowGitHubActions() {
                    const actionsEnv = await utilsConnector.execPeer("getEnvironmentVariable", "GITHUB_ACTIONS");
                    Phoenix.isTestWindowGitHubActions = !!actionsEnv;
                }
                _setIsTestWindowGitHubActions().catch(e=>{
                    console.error("Error setting Phoenix.isTestWindowGitHubActions", e);
                });
            } else {
                const urlSearchParams = new window.URLSearchParams(window.location.search || "");
                Phoenix.isTestWindowGitHubActions = urlSearchParams.get("isTestWindowGitHubActions") === "yes";
            }
        }
    } catch (e) {
        console.error("Error setting Phoenix.isTestWindowGitHubActions", e);
    }

    // private apis
    exports._loadNodeExtensionModule = _loadNodeExtensionModule;
    exports._npmInstallInFolder = _npmInstallInFolder;

    // public apis
    exports.fetchURLText = fetchURLText;
    exports.getPhoenixBinaryVersion = getPhoenixBinaryVersion;
    exports.getLinuxOSFlavorName = getLinuxOSFlavorName;
    exports.openUrlInBrowser = openUrlInBrowser;
    exports.ESLintFile = ESLintFile;
    exports.getEnvironmentVariable = getEnvironmentVariable;
    exports.openNativeTerminal = openNativeTerminal;
    exports.openInDefaultApp = openInDefaultApp;

    /**
     * checks if Node connector is ready
     *
     * @return {boolean} returns true if it's ready, otherwise false
     */
    exports.isNodeReady = NodeConnector.isNodeReady;

    window.NodeUtils = exports;
});
