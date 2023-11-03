import { Action } from 'redux';
import actionTypes from './actionTypes'; // Make sure to import your actionTypes type

export interface FileManagerAction extends Action<actionTypes> {
    config?: any; // Replace 'any' with the appropriate type for config
    mode?: string;
    history?: any[]; // Replace 'any' with the appropriate type for history
    disks?: any[]; // Replace 'any' with the appropriate type for disks
    select_disk?: boolean;
    directories?: any[]; // Replace 'any' with the appropriate type for directories
    select_dir?: boolean;
    files?: any[]; // Replace 'any' with the appropriate type for files
    selected?: any; // Replace 'any' with the appropriate type for selected
    tree?: any[]; // Replace 'any' with the appropriate type for tree
    clipboard?: boolean;
}

export const setConfigfm = (config: any): FileManagerAction => ({
    type: actionTypes.SET_CONFIG_FM,
    config: config,
});
export const setMode = (mode: string): FileManagerAction => ({
    type: actionTypes.SET_MODE,
    mode: mode,
});
export const setHistoryFm = (history: any[]): FileManagerAction => ({
    type: actionTypes.SET_HISTORY_FM,
    history: history,
});
export const setDisks = (disks: any[]): FileManagerAction => ({
    type: actionTypes.SET_DISKS,
    disks: disks,
});
export const setDiskSelect = (disk: boolean): FileManagerAction => ({
    type: actionTypes.SELECT_DISK,
    select_disk: disk,
});
export const setDirectories = (directories: any[]): FileManagerAction => ({
    type: actionTypes.SET_DIRECTORIES,
    directories: directories,
});
export const selectDirectory = (dir: boolean): FileManagerAction => ({
    type: actionTypes.SELECT_DIRECTORY,
    select_dir: dir,
});
export const setFiles = (files: any[]): FileManagerAction => ({
    type: actionTypes.SET_FILES,
    files: files,
});
export const setSelected = (selected: any): FileManagerAction => ({
    type: actionTypes.SET_SELECTED,
    selected: selected,
});
export const setTree = (tree: any[]): FileManagerAction => ({
    type: actionTypes.SET_TREE,
    tree: tree,
});
export const setClipboard = (clipboard: boolean): FileManagerAction => ({
    type: actionTypes.SET_CLIPBOARD,
    clipboard: clipboard,
});
export const clearClipboard = (): FileManagerAction => ({
    type: actionTypes.CLEAR_CLIPBOARD,
    clipboard: false,
});
