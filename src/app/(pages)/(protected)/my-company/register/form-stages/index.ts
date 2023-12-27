import {BasicInformation, basicInformationSchema} from './basic-information';
import {TypeOfBusiness, typeOfBusinessSchema} from './type-of-business';
import {Services, servicesSchema} from './services';
import {Technologies, technologiesSchema} from './technologies';
import {MarketFocus, marketFocusSchema} from './market-focus';

export default {
  1: {component: BasicInformation, schema: basicInformationSchema},
  2: {component: TypeOfBusiness, schema: typeOfBusinessSchema},
  3: {component: Services, schema: servicesSchema},
  4: {component: Technologies, schema: technologiesSchema},
  5: {component: MarketFocus, schema: marketFocusSchema},
};
