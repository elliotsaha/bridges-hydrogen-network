'use client';

import {
  Card,
  CardHeader,
  Img,
  Heading,
  CardBody,
  Text,
  Wrap,
} from '@chakra-ui/react';

import {Subheader} from './subheader';

export const DataCard = () => {
  return (
    <Card overflow="hidden" variant="outline" p="6">
      <CardHeader>
        <Img src="/static/images/brand/cha.png" w="16" mb="4" />
        <Heading as="h4" mb="4" size="xl">
          Canadian Hydrogen Association
        </Heading>
        <Subheader>A Non-profit Organization</Subheader>
      </CardHeader>
      <CardBody>
        <Wrap mt="-6" mb="8">
          <Text>This is the card</Text>
        </Wrap>
        <Text>
          The Canadian Hydrogen and Fuel Cell Association (CHFCA) is a national,
          non-profit sector association comprising industry, academia, research
          agencies and other stakeholders focused on...
        </Text>
        <Text fontWeight="bold" mt="8">
          Are you partnered with this company?{' '}
        </Text>
      </CardBody>
    </Card>
  );
};
