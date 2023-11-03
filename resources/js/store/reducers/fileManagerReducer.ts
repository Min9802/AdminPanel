import { Reducer } from 'redux';
import actionTypes from '../actions/actionTypes'; // Make sure to import your actionTypes and FileManagerAction types

export type FileManagerState = {
    config: any[]; // Replace 'any' with the appropriate type for your config
    mode: string;
    disks: any[]; // Replace 'any' with the appropriate type for disks
    directories: any[]; // Replace 'any' with the appropriate type for directories
    select_disk: boolean;
    select_dir: boolean;
    files: any[]; // Replace 'any' with the appropriate type for files
    tree: any[]; // Replace 'any' with the appropriate type for tree
    clipboard: boolean;
    history: any[]; // Replace 'any' with the appropriate type for history
    selected?: any; // Replace 'any' with the appropriate type for selected
}

const initialState: FileManagerState = {
    config: [],
    mode: 'table',
    disks: [],
    directories: [],
    select_disk: false,
    select_dir: false,
    files: [],
    tree: [],
    clipboard: false,
    history: [],
};

const fileManagerReducer: Reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_HISTORY_FM:
            return {
                ...state,
                history: action.history,
            };
        case actionTypes.SET_CONFIG_FM:
            return {
                ...state,
                config: action.config,
            };
        case actionTypes.SET_MODE:
            return {
                ...state,
                mode: action.mode,
            };
        case actionTypes.SET_DISKS:
            return {
                ...state,
                disks: action.disks,
            };
        case actionTypes.SELECT_DISK:
            return {
                ...state,
                select_disk: action.select_disk,
            };
        case actionTypes.SET_DIRECTORIES:
            return {
                ...state,
                directories: action.directories,
            };
        case actionTypes.SELECT_DIRECTORY:
            return {
                ...state,
                select_dir: action.select_dir,
            };
        case actionTypes.SET_FILES:
            return {
                ...state,
                files: action.files,
            };
        case actionTypes.SET_TREE:
            return {
                ...state,
                tree: action.tree,
            };
        case actionTypes.SET_CLIPBOARD:
            return {
                ...state,
                clipboard: action.clipboard,
            };
        case actionTypes.CLEAR_CLIPBOARD:
            return {
                ...state,
                clipboard: false,
            };
        case actionTypes.SET_SELECTED:
            return {
                ...state,
                selected: action.selected,
            };
        default:
            return state;
    }
};

export default fileManagerReducer;
