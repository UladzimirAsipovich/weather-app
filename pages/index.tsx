import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import ChangeCitiesButtons from '../components/ChangeCitiesButtons/ChangeCitiesButtons';
import MetaHead from '../components/MetaHead/MetaHead';
import useModal from '../components/Modal/Modal';
import DynamicSVG from '../components/svgIcon/DynamicSVG';
import Widget from '../components/WeatherWidget/Widget';
import { AvailableCities } from '../components/_VAR';

export interface IWeatherDayType {
  main: {
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  dt_txt: string;
  weather: Array<{
    description: string;
    main: string;
    icon: string;
  }>;
}

export interface IWeatherType {
  city: {
    name: string;
    country: string;
  };
  list: Array<IWeatherDayType>;
  message: string | number;
}

const Index: NextPage = () => {

  const [DefaultLocation, setDefaultLocation] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const storageCity = localStorage.getItem('DefaultLocation');
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
            SetWeatherData(currentWeatherForCity);
            SetIsFetching(false);
            SetIsLoad(true);
            return;
          }
          setDefaultLocation(AvailableCities[0]);
          localStorage.removeItem('DefaultLocation');
          SetIsFetching(false);
        });
    },
    [isFetching],
  );

  useEffect(() => {

    if (!localStorage.getItem('DefaultLocation')) {

      ShowModal({
        type: 'info',
        title: 'Hi! Are you maybe a first visit here and you want to change your current location?',
        AvailableCities,
        onOk: (cityName: string) => {
          const selectedCity = AvailableCities.find(city => city === cityName) || AvailableCities[0];
          getAndCacheWeatherFor(selectedCity);
        },
        onCancel: () => {
          getAndCacheWeatherFor(AvailableCities[0]);
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
          SetIsLoad(true);
          return;
        } catch (error) {
          console.log(error);
          getAndCacheWeatherFor(DefaultLocation);
        }

      } else {
        getAndCacheWeatherFor(DefaultLocation);
        return;
      }
    }
  }, [DefaultLocation]);

  return (
    <>
      <MetaHead />
      <div className="container p-4 mx-auto">
        {
          isLoad && WeatherData ? (
            <>
              <Widget Weather={WeatherData} />
              <ChangeCitiesButtons
                Fetching={isFetching}
                ChangingCities={AvailableCities}
                CurrentLocation={DefaultLocation}
                SetLocation={(data) => {
                  const selectedCity = AvailableCities.find(city => city === data) || AvailableCities[0];
                  localStorage.setItem('DefaultLocation', selectedCity);
                  setDefaultLocation(selectedCity);
                }}
              />
            </>
          ) : (
            <div className='mx-auto rounded-xl p-6 bg-blue-50 max-w-lg shadow-lg mb-5'>
              <p className='py-20'>Weather is loading...</p>
            </div>
          )
        }
        <div className='mt-72'>
          <h2>DynamicSVG</h2>
          <DynamicSVG iconName='arrowLongLeft' className='w-40 h-40 fill-slate-300 stroke-slate-200 stroke-1' />
          <DynamicSVG iconName='arrowLongRight' className='w-40 h-40 fill-slate-600 stroke-slate-400 stroke-2' />
        </div>
      </div>
    </>

  );
};

export default Index;
