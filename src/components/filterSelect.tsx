import {useState} from 'react';
import {InputActionMeta, Select} from 'chakra-react-select';
import {Controller, Control, Path} from 'react-hook-form';

interface SelectOption {
  label: string;
  value: string;
}

type OptionFieldValues = {
  [x: string]: Array<SelectOption>;
};

interface FilterSelectProps<T extends OptionFieldValues> {
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

  return (
    <Controller
      control={control}
      name={name}
      render={({field: {onChange, value, name, ref}}) => (
        <Select
          inputValue={selectVal}
          onInputChange={inputChangeHandler}
          placeholder={`${value.length} filter${
            value.length === 1 ? '' : 's'
          } selected`}
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
