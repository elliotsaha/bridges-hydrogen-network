import {BrandDetails, brandDetailsSchema} from './brand-details';
import {BasicInformation, basicInformationSchema} from './basic-information';
import {TypeOfBusiness, typeOfBusinessSchema} from './type-of-business';
import {Services, servicesSchema} from './services';
import {Technologies, technologiesSchema} from './technologies';
import {MarketFocus, marketFocusSchema} from './market-focus';

export default {
  1: {component: BrandDetails, schema: brandDetailsSchema},
  2: {component: BasicInformation, schema: basicInformationSchema},
  3: {component: TypeOfBusiness, schema: typeOfBusinessSchema},
  4: {component: Services, schema: servicesSchema},
  5: {component: Technologies, schema: technologiesSchema},
  6: {component: MarketFocus, schema: marketFocusSchema},
};
