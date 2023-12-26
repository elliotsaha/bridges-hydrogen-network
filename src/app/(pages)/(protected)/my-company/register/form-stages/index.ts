import {BasicInformation, basicInformationSchema} from './basic-information';
import {TypeOfBusiness, typeOfBusinessSchema} from './type-of-business';
import {Services, servicesSchema} from './services';
import {Technologies, technologiesSchema} from './technologies';
import {MarketFocus, marketFocusSchema} from './market-focus';
import {operatingRegions} from './basic-information';
import {typesOfBusinesses} from './type-of-business';
import {services} from './services';
import {marketFocuses} from './market-focus';
import {technologies} from './technologies';

export default {
  1: {component: BasicInformation, schema: basicInformationSchema},
  2: {component: TypeOfBusiness, schema: typeOfBusinessSchema},
  3: {component: Services, schema: servicesSchema},
  4: {component: Technologies, schema: technologiesSchema},
  5: {component: MarketFocus, schema: marketFocusSchema},
};

export const formOptions = (() => {
  const flatTechnologies = technologies.map(i => i.technologies).flat();

  return {
    operatingRegions,
    typesOfBusinesses,
    services,
    marketFocuses,
    technologies: flatTechnologies,
  };
})();
