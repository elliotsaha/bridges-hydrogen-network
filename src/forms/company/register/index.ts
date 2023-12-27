import {operatingRegions} from './operating-regions';
import {typesOfBusinesses} from './types-of-businesses';
import {services} from './services';
import {marketFocuses} from './market-focuses';
import {technologies} from './technologies';

export * from './operating-regions';
export * from './types-of-businesses';
export * from './services';
export * from './market-focuses';
export * from './technologies';

export const strictFormOptions = (() => {
  const flatTechnologies = technologies.map(i => i.technologies).flat();

  return {
    operatingRegions,
    typesOfBusinesses,
    services,
    marketFocuses,
    technologies: flatTechnologies,
  };
})();
