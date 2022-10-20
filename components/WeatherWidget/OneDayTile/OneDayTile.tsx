import Image from 'next/image';
import type { IWeatherDayType } from '../../../pages';

interface PropType {
  Day: IWeatherDayType;
}

const OneDayTile: React.FC<PropType> = (props): JSX.Element => {

  return (
    <div className='text-center'>
      <header>
        <span>{new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date(props.Day.dt_txt))}</span>
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
        <strong>{props.Day.main.temp_min}ºC/{props.Day.main.temp_max}ºC</strong>
      </footer>
    </div>
  );
};

export default OneDayTile;