import Link from 'next/link';
import Image from 'next/image';
import type { IWeatherType } from '../../pages';
import OneDayTile from './OneDayTile/OneDayTile';

interface PropType {
  Weather: IWeatherType
}

const Widget: React.FC<PropType> = (props): JSX.Element => {

  return (
    <div className='mx-auto rounded-xl p-6 bg-blue-50 max-w-lg shadow-lg mb-5'>
      <header className='flex justify-between mb-5'>
        <span className='font-light sm:text-2xl' title='Your current location'><span className='font-light text-gray-300'>{props.Weather.city.country}, </span> {props.Weather.city.name}<sup className='text-gray-400 font-light bg-green-200 px-2 rounded-full text-xs relative -top-3'>current</sup></span>
        <small className='text-gray-400 font-serif font-light select-none'>JustWeather</small>
      </header>
      <div className='flex mb-4'>
        <div className='relative w-28 flex-grow-0 bottom-4'>
          <Image
            src={`http://openweathermap.org/img/wn/${props.Weather.list[0].weather[0].icon}@2x.png`}
            layout='responsive'
            width={50}
            height={50}
            alt={props.Weather.list[0].weather[0].description}
          />
        </div>
        <div className='grow'>
          <div className='flex justify-between items-center'>
            <span className='font-medium md:text-6xl text-4xl text-gray-800'>{props.Weather.list[0].main.temp} ºC</span>
          </div>
          <div>
            <strong className='text-gray-400'>{props.Weather.list[0].weather[0].description}</strong>
          </div>
        </div>
      </div>
      <footer className='sm:block md:columns-3 mb-4'>
        {
          [props.Weather.list[8], props.Weather.list[16], props.Weather.list[24]].map((data, ind) => (<OneDayTile key={ind} Day={data} />))
        }
      </footer>
      <Link href={{
        pathname: '/in/[location]',
        query: { location: props.Weather.city.name },
      }}>
        <a className='text-sm text-gray-400 hover:text-gray-600 hover:underline transition-colors'>View hourly forecast weather for <strong>{props.Weather.city.name}</strong> city</a>
      </Link>
    </div>
  );
};

export default Widget;