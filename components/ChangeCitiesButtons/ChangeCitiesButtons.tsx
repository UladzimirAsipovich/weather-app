/**
 * The "Change Cities Buttons" component.
 */

interface PropType {
  Fetching: boolean; // if true - buttons will be blur, and blocked to users click
  ChangingCities: string[]; // An array of available default cities
  CurrentLocation: string; // Accepting for active button
  SetLocation: (city: string) => void; // Set selected location to state
}

export type CityNameType = [Name: string, Country: string];

const ChangeCitiesButtons: React.FC<PropType> = (props): JSX.Element => {

  return (
    <div className={`mx-auto max-w-lg sm:block md:flex gap-4 ${props.Fetching ? 'select-none blur-sm' : null}`}>
      {
        props.ChangingCities.map((city, ind) => {

          const parseCityName: CityNameType = city.match(/\w+/g) as CityNameType;

          return (
            <button
              key={city + ind}
              className={`${city === props.CurrentLocation ? 'bg-green-100 text-gray-800' : null} w-full rounded-lg px-4 py-2 text-gray-400 hover:bg-gray-50 transition-colors`}
              onClick={() => {
                if (props.Fetching) return;
                props.SetLocation(city);
              }}
            >
              <span className='font-light text-gray-300'>{parseCityName[1]}</span>, <span>{parseCityName[0]}</span>
            </button>
          );
        })
      }
    </div>
  );
};

export default ChangeCitiesButtons;