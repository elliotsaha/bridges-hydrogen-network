'use client';
import React from 'react';
import {
  Modal,
  ModalOverlay,
  Container,
  Text,
  Box,
  Heading,
  Img,
  Flex,
  Divider,
  Button,
  Tooltip,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  UnorderedList,
  ListItem,
  Badge,
  Card,
  CardBody,
  Icon,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  VStack,
} from '@chakra-ui/react';
import {
  FiMap,
  FiLock,
  FiMapPin,
  FiPackage,
  FiTool,
  FiRadio,
  FiPlusCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import {useQuery} from '@tanstack/react-query';
import {Company} from '@models';
import axios from 'axios';
import {FormOptionData} from '@types';
import {IconType} from 'react-icons';

const CompanyDetail = ({params}: {params: {id: string}}) => {
  const fetchCompany = async () => {
    const res = await axios.post<Company>(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/api/company/detail`,
      params
    );
    return res.data;
  };

  const {isLoading, isError, data} = useQuery({
    queryKey: [`company/${params.id}`],
    queryFn: fetchCompany,
  });

  interface DataLine {
    icon: IconType;
    title: string;
    arr: Array<FormOptionData>;
  }

  const GenerateDataLine = ({icon, title, arr}: DataLine) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const CUTOFF = 2;
    return (
      <>
        <Flex
          alignItems="flex-start"
          gap="1"
          color="gray.500"
          my="2"
          flexDirection="column"
        >
          <Flex alignItems="center" gap="2" mr="-1">
            {React.createElement(icon)}
            <Text fontWeight="bold" color="gray.500" display="inline">
              {title}:
            </Text>
          </Flex>
          <Box
            color="gray.500"
            display={{base: 'flex', sm: 'inline-block'}}
            flexDirection={{base: 'column', sm: 'row'}}
          >
            {arr.length > CUTOFF ? (
              <Box
                display={{base: 'flex', sm: 'block'}}
                flexDirection="column"
                alignItems="flex-start"
                gap="2"
              >
                {arr.slice(0, CUTOFF).map(i =>
                  i.description ? (
                    <Tooltip label={i.description} borderRadius="lg" p="3">
                      <Text
                        display={{base: 'block', sm: 'inline'}}
                      >{`${i.name}, `}</Text>
                    </Tooltip>
                  ) : (
                    <Text
                      display={{base: 'block', sm: 'inline'}}
                    >{`${i.name}, `}</Text>
                  )
                )}
                <Button variant="link" colorScheme="blue" onClick={onOpen}>
                  View {arr.length - CUTOFF} more
                </Button>
              </Box>
            ) : (
              <Box
                display={{base: 'flex', sm: 'block'}}
                flexDirection="column"
                alignItems="flex-start"
                gap="2"
              >
                {arr.map((i, idx) =>
                  i.description ? (
                    <Tooltip label={i.description} borderRadius="lg" p="3">
                      <Text display={{base: 'block', sm: 'inline'}}>
                        {idx === arr.length - 1 ? i.name : `${i.name}, `}
                      </Text>
                    </Tooltip>
                  ) : (
                    <Text display={{base: 'block', sm: 'inline'}}>
                      {idx === arr.length - 1 ? i.name : `${i.name}, `}
                    </Text>
                  )
                )}
              </Box>
            )}
          </Box>
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader display="flex" alignItems="center" gap="2">
              {React.createElement(icon, {fontSize: '18'})}
              {title}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <UnorderedList listStyleType="none" m="0" p="0">
                {arr.map((i, idx) => (
                  <>
                    {i.description ? (
                      <Tooltip
                        label={i.description}
                        borderRadius="lg"
                        p="3"
                        placement="left"
                      >
                        <ListItem my="2">{i.name}</ListItem>
                      </Tooltip>
                    ) : (
                      <ListItem my="2">{i.name}</ListItem>
                    )}
                    {idx !== arr.length - 1 && <Divider />}
                  </>
                ))}
              </UnorderedList>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  };

  return (
    <>
      <Container maxW="container.xl" mb="24">
        {/* Loading State */}
        {isLoading && (
          <Container maxW="container.xl">
            <Box mt="14">
              <VStack
                align="flex-start"
                spacing="4"
                w={{base: '100%', lg: '65%'}}
              >
                <SkeletonCircle size="16" mb="2" />
                <Skeleton
                  w={{base: '100%', lg: '50%'}}
                  h="12"
                  borderRadius="lg"
                />
                <SkeletonText
                  borderRadius="lg"
                  noOfLines={2}
                  spacing="4"
                  skeletonHeight="2"
                  mt="4"
                  w={{base: '100%', lg: '60%'}}
                />
                <Skeleton
                  w={{base: '100%', lg: '70%'}}
                  h="36"
                  borderRadius="lg"
                />
                <SkeletonText
                  borderRadius="lg"
                  noOfLines={6}
                  spacing="4"
                  skeletonHeight="2"
                  mt="4"
                  w={{base: '100%', lg: '60%'}}
                />
              </VStack>
            </Box>
          </Container>
        )}

        {/* Error state */}
        {isError && (
          <Container maxW="container.xl" mb="24">
            <VStack mt="8" justifyContent="center" w="100%">
              <Icon as={FiAlertCircle} fontSize="32" color="red.400" />
              <Text color="gray.600" textAlign="center" w="48">
                An unexpected error has occurred
              </Text>
            </VStack>
          </Container>
        )}

        {/* Data State */}
        {data && (
          <Flex
            flexDirection={{base: 'column', lg: 'row'}}
            alignItems="center"
            gap="12"
          >
            <Box mt="14" w={{base: '100%', lg: '50%'}}>
              <Img src="/static/images/brand/cha.png" w="16" mb="2" />
              <Heading as="h1">{data.company_name}</Heading>
              <Text mt="2" color="brand.400" fontWeight="bold">
                {/*REMOVE SLICE LATER*/}
                {data.type_of_business
                  .map(i => i.name)
                  .slice(0, 3)
                  .join(' • ')}
              </Text>
              <Badge
                mt="3"
                fontSize="14"
                whiteSpace="unset"
                colorScheme={data.less_than_2_years ? 'gray' : 'brand'}
              >
                {data.less_than_2_years
                  ? 'Less than 2 years in business'
                  : `${data.years_in_business} years in business`}
              </Badge>
              <Divider my="4" />
              <Flex
                alignItems={{base: 'flex-start', sm: 'center'}}
                gap="2"
                color="gray.500"
                mb="2"
                flexDirection={{base: 'column', sm: 'row'}}
              >
                <FiMapPin />
                <Box
                  display={{base: 'flex', sm: 'inline-block'}}
                  flexDirection="column"
                >
                  <Text fontWeight="bold" color="gray.500" display="inline">
                    Headquarters Location:{' '}
                  </Text>
                  <Text color="gray.500" display="inline">
                    {data.headquarters_location.label}
                  </Text>
                </Box>
              </Flex>

              <Box display="inline-block">
                <Flex
                  color="gray.500"
                  flexWrap="wrap"
                  alignItems={{base: 'flex-start', sm: 'center'}}
                  gap="2"
                  flexDirection={{base: 'column', sm: 'row'}}
                  mt={{base: '4', sm: '0'}}
                >
                  <FiMap />
                  <Text fontWeight="bold" color="gray.500" display="inline">
                    Operating Regions:
                  </Text>
                  {data.operating_regions.map((i, idx) => (
                    <Text whiteSpace="nowrap" display="inline">
                      {idx === data.operating_regions.length - 1 ? i : `${i}, `}
                    </Text>
                  ))}
                </Flex>
              </Box>
              <Divider my="4" />
              <Text color="gray.600">
                {/* REPLACE WITH COMPANY DESCRIPTION LATER */}
                IHYDRO is an Online Hydrological Telemetry System developed to
                provide platform for real-time flood and drought monitoring. It
                is also a public domain for Hydrological Telemetry System (HTS)
                under Centralized Information Telemetry Networks (CITN). The
                displayed of real time rainfall and water level data enables the
                occurrence of flooding in Sarawak be monitored and assessed at
                the earlier stage to minimize damage on property and loss of
                life.
              </Text>
              <Divider my="4" />

              <Flex flexDirection="column" gap={{base: '4', sm: '1'}}>
                <GenerateDataLine
                  icon={FiRadio}
                  title="Market Focus"
                  arr={data.market_focus}
                />
                <GenerateDataLine
                  icon={FiPackage}
                  title="Services"
                  arr={data.services}
                />
                <GenerateDataLine
                  icon={FiTool}
                  title="Technologies"
                  arr={data.technologies}
                />
              </Flex>
            </Box>
            <Flex
              justifyContent={{base: 'flex-start', lg: 'center'}}
              w={{base: '100%', lg: '50%'}}
              mb={{base: '0', lg: '44'}}
            >
              <Card variant="outline" w="sm" p="3">
                <CardBody textAlign="center">
                  <Icon as={FiLock} fontSize="32" color="brand.400" mb="2" />
                  <Heading size="md">View Team Emails</Heading>
                  <Text color="gray.500" mt="2" mb="6">
                    Partner with this company to view the email addresses and
                    roles of each member of this company
                  </Text>
                  <Button
                    colorScheme="brand"
                    size={{base: 'sm', md: 'md'}}
                    leftIcon={<Icon as={FiPlusCircle} />}
                  >
                    Add Partner
                  </Button>
                </CardBody>
              </Card>
            </Flex>
          </Flex>
        )}
      </Container>
    </>
  );
};

export default CompanyDetail;
