import React, { useEffect, useState } from 'react';
import { ONLY_ENG_LETTERS_REGEXP } from '../_VAR';


interface PropType extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  type: React.HTMLInputTypeAttribute | undefined; // type of input
  label?: string | undefined; // label of input
  helpLabel?: { ok: string, wrong: string } | undefined; // help label
  name: string; // name input, and auto id
  minLength?: number | undefined;
  maxLength?: number | undefined;
  required?: boolean | undefined;// required input
  pattern?: string | undefined; // RegExp pattern
  placeholder?: string | undefined; // tittle of placeholder when cursor on element
  toClean?: number | undefined; // function which cleaning field to defaults values
  toRequired?: React.Dispatch<React.SetStateAction<Object>> | undefined; // function which do form element is required for validate
}

interface checker extends React.ChangeEventHandler<HTMLInputElement>, React.ChangeEventHandler<HTMLTextAreaElement> { }

const Field: React.FC<PropType> = (props): JSX.Element => {

  const [wrong, setWrong] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    if (props.toClean !== undefined) {
      setChecked(false);
      setWrong(false);

      if (props.required && props.toRequired) {
        props.toRequired((prevState) => {
          return { ...prevState, [props.name]: false };
        });
      }
    }

  }, [props.toClean]);

  useEffect(() => {
    if (props.required && props.toRequired) {
      props.toRequired((prevState) => {
        return { ...prevState, [props.name]: false };
      });
    }
  }, []);

  const checker: checker = ({ currentTarget, currentTarget: { value } }: any): void => {
    if (value.length === 0) {
      setChecked(false);
      setWrong(false);
      return;
    }

    let testResult: boolean = false;

    switch (props.type) {
      case 'text': {
        testResult = ONLY_ENG_LETTERS_REGEXP(2, 20).test(value);
        break;
      }
    }

    if (testResult) {
      !checked && setChecked(true);
      wrong && setWrong(false);

      if (props.required && props.toRequired) {
        props.toRequired((prevState) => {
          return { ...prevState, [props.name]: true };
        });
      }

    } else {
      checked && setChecked(false);
      !wrong && setWrong(true);

      if (props.required && props.toRequired) {
        props.toRequired((prevState) => {
          return { ...prevState, [props.name]: false };
        });
      }
    }
  };

  return (
    <div className='mb-4'>
      {props.label ? (<label htmlFor={props.name} className={''}>{props.label}</label>) : null}

      {
        props.type !== 'textarea' ? (
          <input
            className={`block px-4 py-2 border-2 rounded-lg ${wrong ? 'border-red-400 outline-red-400' : null}`}
            type={props.type ?? 'text'}
            name={props.name}
            id={props.name}
            minLength={props.minLength ?? 2}
            maxLength={props.maxLength ?? 50}
            defaultValue=""
            placeholder={props.placeholder ?? ''}
            onChange={checker}
          />
        ) : (
          <textarea
            name={props.name}
            className={''}
            id={props.name}
            minLength={props.minLength ?? 2}
            maxLength={props.maxLength ?? 250}
            defaultValue=""
            placeholder={props.placeholder ?? ''}
            onChange={checker}
          />
        )
      }
      <small className={'text-xs'}>{wrong ? props.helpLabel?.wrong : props.helpLabel?.ok}</small>
    </div>
  );
};

export default Field;