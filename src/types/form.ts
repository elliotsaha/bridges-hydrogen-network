import React from 'react';
import {UseFormReturn, FieldValues} from 'react-hook-form';
import {ZodType} from 'zod';
import {SelectOption} from './react-select';

export type FormEvent = React.FormEvent<HTMLFormElement>;

export type FormControl<T extends FieldValues> = UseFormReturn<T>;

export interface FormRegistration<T extends FieldValues> {
  formControl: FormControl<T>;
  formNavigation: FormNavigation;
}

export interface FormNavigation {
  next(e: FormEvent): void;
  back(): void;
  submit(): void;
}

export interface FormOptions {
  operating_regions: SelectOption[];
  market_focus: SelectOption[];
  services: SelectOption[];
  technologies: SelectOption[];
  type_of_business: SelectOption[];
  years_in_business?: SelectOption;
}
export interface FormOptionData {
  name: string;
  description?: string;
}

export interface StepForm<T extends FieldValues> {
  component: React.FC<FormRegistration<T>>;
  schema: ZodType<T>;
}
