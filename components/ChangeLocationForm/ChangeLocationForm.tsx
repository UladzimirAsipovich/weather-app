import { useEffect, useState } from 'react';
import type { IWeatherType } from '../../pages';
import Field from '../Field/Field';

interface PropType extends React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
  setLocation: (location: string) => void; // Set selected location to state
  setWeatherData: React.Dispatch<React.SetStateAction<IWeatherType | null>> // Set weather data to state
}

const ChangeLocationForm: React.FC<PropType> = (props): JSX.Element => {
  const [clean, setClean] = useState<number>(0); // form reset state trigger
  const [valid, setValid] = useState<boolean>(false); // form validation status
  const [requiredFields, setRequiredFields] = useState<Object>({}); // store of required fields validate status

  const cleaner: React.MouseEventHandler<HTMLButtonElement> = (): void => {
    setClean((clean + 1));
    setValid(false);
  };

  const submitter: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.target as HTMLFormElement;

    props.setLocation(form.location.value);
    setClean((clean + 1));
    setValid(false);
    form.reset();
  };

  useEffect(() => {
    let isValid: boolean = false;

    if (Object.values(requiredFields).length) {
      isValid = Object.values(requiredFields).every((el) => el === true);
    }

    if (isValid) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [requiredFields]);

  return (
    <form className='' onSubmit={submitter}>
      <Field
        name='location'
        type='text'
        label='You can also view weather forecast for other cities:'
        placeholder='Enter city name'
        helpLabel={{ ok: '', wrong: 'This field supporting latin characters only!' }}
        toClean={clean}
        toRequired={setRequiredFields}
        required
      />
      <button type="submit" disabled={!valid}
        className='px-4 py-2 border-2 rounded-lg text-white transition-colors bg-blue-400 hover:bg-blue-600 disabled:bg-slate-300'
      >
        Change Location
      </button>
    </form>
  );
};

export default ChangeLocationForm;