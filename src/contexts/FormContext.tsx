import {createContext} from 'react';

export interface FormContext {
  submitting: boolean;
}

export const FormContext = createContext<FormContext>({submitting: false});
