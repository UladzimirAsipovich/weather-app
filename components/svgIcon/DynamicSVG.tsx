import * as Svgs from './svgs';

interface PropType {
  iconName?: string | 'arrowLongLeft';
  className?: string;
}

const DynamicSVG: React.FC<PropType> = (props) => {
  const { ...iconsSvgs } = Svgs as { [key: string]: React.FC<PropType> };

  const RequiredIcon = iconsSvgs[props.iconName || 'arrowLongLeft'];

  return (
    <>
      <RequiredIcon className={props.className} />
    </>
  );
};

export default DynamicSVG;