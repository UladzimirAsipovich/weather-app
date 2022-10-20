import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import { useCallback, useEffect, useState } from 'react';
import type { IWeatherType } from '../index';
import { AvailableCities } from '../../components/_VAR';
import ChangeLocationForm from '../../components/ChangeLocationForm/ChangeLocationForm';
import HourTile from '../../components/WeatherWidget/HourTile/HourTile';
import OneDayTile from '../../components/WeatherWidget/OneDayTile/OneDayTile';
import useModal from '../../components/Modal/Modal';
import MetaHead from '../../components/MetaHead/MetaHead';

interface PropType {
  currentLocation: string
  Weather: IWeatherType
}

type CityNameType = [Name: string, Country: string];

const HourlyWeatherByLocation: React.FC<PropType> = (props) => {
  const router = useRouter();
  const { location } = router.query;

  const [serverStatus] = useState<boolean>(props.Weather.message === 0);
  const [cityIsNotFound, SetCityIsNotFound] = useState<boolean>(false);
  const [CurrentLocation, SetCurrentLocation] = useState<typeof location>(() => {
    return location || props.currentLocation;
  });

  const [DefaultLocation, setDefaultLocation] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const storageCity = localStorage.getItem('DefaultLocation');
      if (storageCity && localStorage.getItem(storageCity)) {
        return storageCity;
      }
      return AvailableCities.find(city => city === storageCity) || AvailableCities[0];
    }
    return AvailableCities[0];
  });

  const [WeatherData, SetWeatherData] = useState<IWeatherType | null>(() => {
    return null;
  });

  const [isLoad, SetIsLoad] = useState<boolean>(false);
  const [isFetching, SetIsFetching] = useState<boolean>(false);

  const { ShowModal } = useModal();

  const getAndCacheWeatherFor = useCallback(
    async (city: string) => {
      if (isFetching) return;

      SetIsFetching(true);

      const normalizeName = city.match('\\w+')?.toString();
      if (!normalizeName) {
        setDefaultLocation(AvailableCities[0]);
        localStorage.removeItem('DefaultLocation');
        SetIsFetching(false);
      }

      await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${normalizeName}&cnt=25&units=metric&appid=48f58ae9f7eda0872224b5872c167cb0`)
        .then((res) => res.json())
        .then((currentWeatherForCity: IWeatherType) => {
          if (currentWeatherForCity.message === 0) {
            localStorage.setItem('DefaultLocation', `${currentWeatherForCity.city.name}-${currentWeatherForCity.city.country}`);
            localStorage.setItem('cachedLastWeatherDataUpdated', new Date().getTime().toString());
            localStorage.setItem(`${currentWeatherForCity.city.name}-${currentWeatherForCity.city.country}`, JSON.stringify(currentWeatherForCity));

            setDefaultLocation(`${currentWeatherForCity.city.name}-${currentWeatherForCity.city.country}`);
            SetCurrentLocation(currentWeatherForCity.city.name);
            SetWeatherData(currentWeatherForCity);

            SetIsFetching(false);
            SetCityIsNotFound(false);
            SetIsLoad(true);
            return;
          }
          localStorage.removeItem('DefaultLocation');
          SetCityIsNotFound(true);
          SetIsFetching(false);
        });
    },
    [isFetching],
  );

  useEffect(() => {

    if (!localStorage.getItem(DefaultLocation) || cityIsNotFound || (serverStatus === false)) {

      ShowModal({
        type: 'error',
        title: 'Hi! Yor city is not found you must to change your current location.',
        AvailableCities,
        onOk: async (cityName: string) => {
          const selectedCity = cityName;
          const parseCityName: CityNameType = cityName.match(/\w+/g) as CityNameType;

          if (localStorage.getItem(selectedCity)) {
            setDefaultLocation(selectedCity);
            const currentWeatherForCity = JSON.parse(localStorage.getItem(DefaultLocation) as string);
            SetWeatherData(currentWeatherForCity);
            localStorage.setItem('DefaultLocation', `${currentWeatherForCity.city.name}-${currentWeatherForCity.city.country}`);

            router.push(`/in/${parseCityName[0]}`);
            return;
          }
          await getAndCacheWeatherFor(selectedCity);
        },
        onCancel: async () => {
          await getAndCacheWeatherFor(AvailableCities[0]);
        }
      });
      return;
    } else {

      if (localStorage.getItem(DefaultLocation)) {

        try {

          const storageWeather: IWeatherType = JSON.parse(localStorage.getItem(DefaultLocation) as string);
          const lastUpdatedCache = Number(localStorage.getItem('cachedLastWeatherDataUpdated'));
          const three_hours = 10800000;
          const lastUpdatedForCurrentCityCache = new Date(storageWeather.list[0].dt_txt).getTime();

          if (lastUpdatedCache > (lastUpdatedForCurrentCityCache + three_hours)) {
            getAndCacheWeatherFor(DefaultLocation);
            return;
          }
          SetWeatherData(storageWeather);
          SetCurrentLocation(storageWeather.city.name);
          SetIsLoad(true);
          return;
        } catch (error) {
          getAndCacheWeatherFor(DefaultLocation);
        }

      } else {
        getAndCacheWeatherFor(DefaultLocation);
        return;
      }
    }
  }, [DefaultLocation, cityIsNotFound, getAndCacheWeatherFor, serverStatus]);

  return (
    <>
      <MetaHead />
      <div className="container p-4 mx-auto max-w-6xl">
        <nav className='mb-16'>
          <Link href={'/'}><a>Go to Home</a></Link>
        </nav>
        <header className='mb-4'>
          <h4 className='text-xs text-gray-400'>Thank you for using our service! <span className='text-gray-400 font-serif font-light select-none'>JustWeather just for you!</span></h4>
          <h1 className='text-2xl font-light'>You see daily and hourly forecast weather for <strong>{WeatherData?.city.name}</strong> city.</h1>
        </header>

        <div className='mx-auto'>
          <div className='rounded-xl p-6 bg-blue-50 shadow-lg mb-5'>
            <span className='font-serif font-light mb-6 inline-block w-full text-center text-xl'>Daily weather forecast</span>
            {
              WeatherData ? (
                <div className='md:columns-3'>
                  {
                    [WeatherData.list[8], WeatherData.list[16], WeatherData.list[24]].map((data, ind) => (<OneDayTile key={ind} Day={data} />))
                  }
                </div>
              ) : (<p>Weather is loading...</p>)
            }
          </div>
          <div className='mb-8 rounded-xl p-6 bg-blue-50 shadow-lg'>
            <span className='font-serif font-light mb-6 inline-block w-full text-center text-xl'>Hourly weather forecast</span>
            {
              WeatherData ? (
                <div className='md:columns-8'>
                  {
                    WeatherData.list.slice(0, 8).map((data, ind) => (<HourTile key={ind} Day={data} />))
                  }
                </div>
              ) : (<p>Weather is loading...</p>)
            }
          </div>
        </div>

        <ChangeLocationForm
          setLocation={async (location) => {
            let normalize = location.toLowerCase();
            normalize = normalize[0].toUpperCase() + normalize.slice(1);

            await getAndCacheWeatherFor(normalize);

            if (cityIsNotFound) {
              return;
            };

            SetCurrentLocation(normalize);
            router.push(`/in/${normalize}`);
          }}
          setWeatherData={SetWeatherData}
        />
      </div>
    </>

  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  // /_next/data/development/in/Minsk.json?location=Minsk
  // /in /Minsk
  const searchingCity = req?.url?.match(/(\/in\/\w+)/g)?.join('').slice(4);

  const Weather = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchingCity}&cnt=25&units=metric&appid=48f58ae9f7eda0872224b5872c167cb0`)
    .then((res) => res.json())
    .then((data) => {

      return (data);
    }).catch((e) => {
      console.log('Error', e);
    });

  return { props: { currentLocation: searchingCity, Weather } };
};

export default HourlyWeatherByLocation;