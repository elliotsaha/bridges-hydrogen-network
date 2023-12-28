import {useState} from 'react';
import {InputActionMeta, Select, Props} from 'chakra-react-select';
import {Controller, Control, Path} from 'react-hook-form';

interface SelectOption {
  label: string;
  value: string;
}

type OptionFieldValues = {
  [x: string]: Array<SelectOption>;
};

interface FilterSelectProps<T extends OptionFieldValues> extends Props {
  control: Control<T>;
  name: Path<T>;
  options: SelectOption[];
}

function FilterSelect<T extends OptionFieldValues>({
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

  const createPlaceholder = (value: SelectOption[]) => {
    const len = value?.length || 0;
    return `${len} filter${len === 1 ? '' : 's'} selected`;
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({field: {onChange, value, name, ref}}) => (
        <Select
          inputValue={selectVal}
          onInputChange={inputChangeHandler}
          placeholder={createPlaceholder(value)}
          options={options}
          controlShouldRenderValue={false}
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
