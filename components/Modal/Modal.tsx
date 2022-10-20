import React, { useRef } from 'react';
import { useContext, useState } from 'react';

const ModalContext = React.createContext({});

const useModal = () => useContext<any>(ModalContext);

const Modal: React.FC = (): JSX.Element => {

  const { show, ShowModal, CloseModal, data } = useModal();

  const select = useRef<HTMLSelectElement>(null);

  return (
    <>
      {
        show ? (
          <div className='fixed top-0 bottom-0 left-0 right-0 bg-slate-100'>
            <div className='p-4 w-full h-full relative'>
              <button
                className='group absolute right-0 top-0 p-2 w-12 h-12 bg-slate-400 hover:bg-slate-600 transition-colors'
                onClick={() => {
                  if (data.hasOwnProperty('onCancel')) {
                    data.onCancel();
                    return CloseModal();
                  }
                  return CloseModal();
                }}
                title='Close window'
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="group-hover:rotate-90 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className='max-w-md rounded-lg mx-auto overflow-hidden shadow-lg'>
                <header className={`p-4 bg-blue-100 ${data.type === 'info' ? 'bg-blue-100' : data.type === 'error' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                  <h2 className='text-light text-xl font-sans'>{data.title || 'Modal window'}</h2>
                </header>
                <div className='p-4'>
                  <p className='font-serif text-gray-600 mb-4'>We auto detected your current location as <strong className='font-bold'>Minsk</strong> city. You can select another city from available cities list.</p>
                  <select ref={select} name="cities" id="selectCitiesList" className='p-2 rounded-md w-full mb-4'>
                    {(data.AvailableCities as string[]).map((city, ind) => (
                      <option key={city + ind} value={city}>{city}</option>
                    ))}
                  </select>
                  <footer>
                    <button
                      className=' bg-blue-300 rounded-lg px-4 py-2 hover:bg-blue-500 text-white transition-colors' title='Ok, and close window'
                      onClick={() => {
                        if (data.hasOwnProperty('onOk')) {
                          data.onOk(select.current?.value);
                          return CloseModal();
                        }
                        return CloseModal();
                      }}
                    >
                      Change location
                    </button>
                    <button
                      className='rounded-lg px-4 py-2 text-gray-400 hover:text-black transition-colors' title='Cancel and close window'
                      onClick={() => {
                        if (data.hasOwnProperty('onCancel')) {
                          data.onCancel();
                          return CloseModal();
                        }
                        return CloseModal();
                      }}
                    >
                      Cancel
                    </button>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        ) : null
      }
    </>
  );
};

type ModalProps = {
  type: "error" | "info" | "warn";
  title?: string;
  subTitle?: string;
  message?: string;
  onOk?: (data: string) => void;
  onCancel?: () => void;
  AvailableCities: string[];
}

interface PropType {
  children?: React.ReactNode;
}

export const ModalProvider: React.FC<PropType> = ({ children }): JSX.Element => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState<ModalProps | null>(null);

  const ShowModal: (config: ModalProps) => void = (config) => {
    setShow(true);
    setData(config);
  };

  const CloseModal = () => {
    setShow(false);
    setData(null);
  };

  return (
    <ModalContext.Provider value={{
      show,
      setShow,
      data,
      ShowModal,
      CloseModal
    }}>
      {children}
      <Modal />
    </ModalContext.Provider>
  );
};

export default useModal;