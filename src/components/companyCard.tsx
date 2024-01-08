'use client';
import {
  Card,
  Img,
  Heading,
  CardBody,
  Text,
  HStack,
  Icon,
  Badge,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react';
import NextLink from 'next/link';

import {pluralize} from '@utils';

import {FiMapPin, FiUsers, FiPackage, FiMap} from 'react-icons/fi';
import {Company} from '@models';

const badgeText = (company: Company) => {
  if (company.years_in_business) {
    if (company.years_in_business > 100) {
      return '100+ years in business';
    }
    return `${company.years_in_business} years in business`;
  }
  return '< 2 years in business';
};

export const CompanyCard = (company: Company) => {
  return (
    <LinkBox
      as={Card}
      overflow="hidden"
      variant="outline"
      size="lg"
      h="100%"
      w={{
        base: 'auto',
        lg: '72',
      }}
    >
      <CardBody>
        <Img src="/static/images/brand/cha.png" w="10" mb="4" />
        <Heading as="h3" size="md" mb="2">
          <LinkOverlay as={NextLink} href={`/company/detail/${company._id}`}>
            {company.company_name}
          </LinkOverlay>
        </Heading>
        <HStack color="gray.600">
          <Icon as={FiMapPin} />
          <Text
            size="md"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {company.headquarters_location.label}
          </Text>
        </HStack>
        <HStack mt="3" color="gray.500">
          <Icon as={FiPackage} />
          <Text size="md">
            {pluralize(company.services.length, 'Service(s)')}
          </Text>
        </HStack>
        <HStack color="gray.500">
          <Icon as={FiMap} />
          <Text
            size="md"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {pluralize(company.operating_regions.length, 'Operating region(s)')}
          </Text>
        </HStack>
        <HStack color="gray.500">
          <Icon as={FiUsers} />
          <Text
            size="md"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {pluralize(company.partners.length, 'Partner(s)')}
          </Text>
        </HStack>
        <Badge mt="4" px="2">
          {badgeText(company)}
        </Badge>
      </CardBody>
    </LinkBox>
  );
};
