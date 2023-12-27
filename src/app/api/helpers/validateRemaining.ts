// function makes sure that fields passed into POST request is based on formOptions
// e.g. checking if "Hydrogen Producer" exists inside typeofBusiness

import {typeOfBusinesses} from '@/app/(pages)/(protected)/my-company/register/formOptions';
import {services} from '@/app/(pages)/(protected)/my-company/register/formOptions';
import {marketSegmentFocus} from '@/app/(pages)/(protected)/my-company/register/formOptions';
import {technologiesUsed} from '@/app/(pages)/(protected)/my-company/register/formOptions';
import {operatingRegions} from '@/app/(pages)/(protected)/my-company/register/formOptions';

interface Section {
  sectionTitle: string;
  technologies: string[];
}

export class Validator {
  businessNames: string[] = typeOfBusinesses.map(business => business.name);
  serviceNames = services.map(service => service.name);
  segmentNames = marketSegmentFocus.map(segment => segment.name);
  flattenedtechnologiesUsed = technologiesUsed.map(section => {
    return {
      sectionTitle: section.sectionTitle,
      technologies: section.technologies.map(tech =>
        typeof tech === 'string' ? tech : tech.name
      ),
    };
  });
  technologyNames: string[] = this.flattenedtechnologiesUsed.reduce(
    (technologies: string[], section: Section) => {
      return technologies.concat(section.technologies);
    },
    []
  );

  businesses(value: string[]): Boolean {
    return value.every(val => this.businessNames.indexOf(val) > -1);
  }

  services(value: string[]): Boolean {
    return value.every(val => this.serviceNames.indexOf(val) > -1);
  }

  segments(value: string[]): Boolean {
    return value.every(val => this.segmentNames.indexOf(val) > -1);
  }

  technologies(value: string[]): Boolean {
    return value.every(val => this.technologyNames.indexOf(val) > -1);
  }

  regions(value: string[]): Boolean {
    return value.every(val => operatingRegions.indexOf(val) > -1);
  }
}
