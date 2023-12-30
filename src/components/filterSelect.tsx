'use client';
import {useState} from 'react';
import {
  InputActionMeta,
  Select,
  Props,
  ChakraStylesConfig,
} from 'chakra-react-select';
import {Controller, Control, Path, FieldValues} from 'react-hook-form';
import {SelectOption} from '@types';

interface FilterSelectProps<T extends FieldValues> extends Props {
  control: Control<T>;
  name: Path<T>;
  options: SelectOption[];
}

export function FilterSelect<T extends FieldValues>({
  control,
  name,
  options,
  ...props
}: FilterSelectProps<T>) {
  const [selectVal, setSelectVal] = useState<string>();

  const inputChangeHandler = (val: string, e: InputActionMeta) => {
    switch (e.action) {
      case 'set-value':
        setSelectVal('');
        break;
      case 'input-change':
        setSelectVal(val);
        break;
    }
  };

  const createPlaceholder = (value: Array<SelectOption>) => {
    return value?.length === 0 ? 'Select...' : `${value?.length} selected`;
  };

  const createStyles: ChakraStylesConfig = {
    placeholder: css => ({
      ...css,
      whiteSpace: 'nowrap',
    }),
  };
  return (
    <Controller
      control={control}
      name={name}
      render={({field: {onChange, value, name, ref}}) => (
        <Select
          inputValue={selectVal}
          onInputChange={inputChangeHandler}
          placeholder={createPlaceholder(value as Array<SelectOption>)}
          options={options}
          controlShouldRenderValue={false}
          hideSelectedOptions={false}
          closeMenuOnSelect={false}
          selectedOptionStyle="check"
          isMulti
          onChange={onChange}
          value={value}
          name={name}
          ref={ref}
          chakraStyles={createStyles}
          {...props}
        />
      )}
    />
  );
}
