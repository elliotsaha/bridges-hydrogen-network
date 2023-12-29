import {useState} from 'react';
import {InputActionMeta, Select, Props} from 'chakra-react-select';
import {Controller, Control, Path, FieldValues} from 'react-hook-form';
import {SelectOption} from '@types';

interface FilterSelectProps<T extends FieldValues> extends Props {
  control: Control<T>;
  name: Path<T>;
  options: SelectOption[];
}

function FilterSelect<T extends FieldValues>({
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
    return `${value?.length} filter${value?.length === 1 ? '' : 's'} selected`;
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
          selectedOptionStyle="check"
          isMulti
          onChange={onChange}
          value={value}
          name={name}
          ref={ref}
          {...props}
        />
      )}
    />
  );
}

export default FilterSelect;
