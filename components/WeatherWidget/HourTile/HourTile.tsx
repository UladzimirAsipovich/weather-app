import Image from 'next/image';
import type { IWeatherDayType } from '../../../pages';

interface PropType {
  Day: IWeatherDayType;
}

const HourTile: React.FC<PropType> = (props): JSX.Element => {

  return (
    <div className='text-center'>
      <header>
        <small className='text-xs'>{new Intl.DateTimeFormat('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(props.Day.dt_txt))}</small>
      </header>
      <div className='relative w-24 mx-auto'>
        <Image
          src={`http://openweathermap.org/img/wn/${props.Day.weather[0].icon}@2x.png`}
          layout='responsive'
          width={50}
          height={50}
          alt={props.Day.weather[0].description}
        />
      </div>
      <footer>
        <strong>{props.Day.main.temp}ºC</strong>
      </footer>
    </div>
  );
};

export default HourTile;