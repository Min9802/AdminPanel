import { ReactNode } from 'react';

export { default as InputForm } from './InputForm';
export { default as Combobox } from './Combobox';
export { default as MultipleSelect } from './MultipleSelect';
export { default as ContextMenu } from './ContextMenu';
export type FieldProps = {
    name?: string
    label?: string
    type?: string
    iconStart?: ReactNode,
    placeholder?: string,
    description?: string,
}
