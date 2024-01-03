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
} from '@chakra-ui/react';
import {FiMap, FiMapPin, FiPackage, FiTool, FiRadio} from 'react-icons/fi';
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

  const {isPending, isError, data, error} = useQuery({
    queryKey: ['company'],
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
        <Flex alignItems="flex-start" gap="2" color="gray.500" my="2">
          <Flex alignItems="center" gap="2" mr="-1">
            {React.createElement(icon)}
            <Text fontWeight="bold" color="gray.500" display="inline">
              {title}:
            </Text>
          </Flex>
          <Box color="gray.500" display="inline-block">
            {arr.length > CUTOFF ? (
              <Box>
                {arr.slice(0, CUTOFF).map(i =>
                  i.description ? (
                    <Tooltip label={i.description} borderRadius="lg" p="3">
                      <Text display="inline" ml="1">{`${i.name},`}</Text>
                    </Tooltip>
                  ) : (
                    <Text ml="1" display="inline">{`${i.name},`}</Text>
                  )
                )}
                <Button
                  variant="link"
                  colorScheme="blue"
                  ml="1"
                  onClick={onOpen}
                >
                  View {arr.length - CUTOFF} more
                </Button>
              </Box>
            ) : (
              <Box>
                {arr.map((i, idx) =>
                  i.description ? (
                    <Tooltip label={i.description} borderRadius="lg" p="3">
                      <Text ml="1" display="inline">
                        {idx === arr.length - 1 ? i.name : `${i.name},`}
                      </Text>
                    </Tooltip>
                  ) : (
                    <Text ml="1" display="inline">
                      {idx === arr.length - 1 ? i.name : `${i.name},`}
                    </Text>
                  )
                )}
              </Box>
            )}
          </Box>
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>All {title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <UnorderedList listStyleType="none" m="0" p="0">
                {arr.map(i => (
                  <>
                    <ListItem my="2">{i.name}</ListItem>
                    <Divider />
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
      <Container maxW="container.xl">
        {data && (
          <Box mt="14">
            <Img src="/static/images/brand/cha.png" w="16" mb="2" />
            <Heading as="h1">{data.company_name}</Heading>
            <Text mt="2" color="brand.400" fontWeight="bold">
              {data.type_of_business
                .map(i => i.name)
                .slice(0, 3)
                .join(' • ')}
            </Text>
            <Flex alignItems="center" gap="2" color="gray.500" my="2">
              <FiMapPin />
              <Box display="inline-block">
                <Text fontWeight="bold" color="gray.500" display="inline">
                  Headquarters Location:{' '}
                </Text>
                <Text color="gray.500" display="inline">
                  {data.headquarters_location.label}
                </Text>
              </Box>
            </Flex>
            <Box mb="4" display="inline-block" w="48">
              <Flex color="gray.500" w="lg" flexWrap="wrap" gap="1">
                <Flex alignItems="center" gap="2">
                  <FiMap />
                  <Text fontWeight="bold" color="gray.500" display="inline">
                    Operating Regions:
                  </Text>
                </Flex>
                {data.operating_regions.map((i, idx) => (
                  <Text whiteSpace="nowrap" display="inline">
                    {idx === data.operating_regions.length - 1 ? i : `${i}, `}
                  </Text>
                ))}
              </Flex>
            </Box>
            <Text color="gray.600" w="50%">
              IHYDRO is an Online Hydrological Telemetry System developed to
              provide platform for real-time flood and drought monitoring. It is
              also a public domain for Hydrological Telemetry System (HTS) under
              Centralized Information Telemetry Networks (CITN). The displayed
              of real time rainfall and water level data enables the occurrence
              of flooding in Sarawak be monitored and assessed at the earlier
              stage to minimize damage on property and loss of life.
            </Text>
            <Divider w="50%" my="4" />
            <GenerateDataLine
              icon={FiPackage}
              title="Services"
              arr={data.services}
            />
            <GenerateDataLine
              icon={FiRadio}
              title="Market Focus"
              arr={data.market_focus}
            />
            <GenerateDataLine
              icon={FiTool}
              title="Technologies"
              arr={data.technologies}
            />
          </Box>
        )}
      </Container>
    </>
  );
};

export default CompanyDetail;
