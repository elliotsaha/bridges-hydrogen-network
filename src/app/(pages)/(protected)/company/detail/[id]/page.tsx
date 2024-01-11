'use client';
import React, {useState, useEffect} from 'react';
import {
  useToast,
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
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Link,
  useClipboard,
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
  FiCheck,
  FiCopy,
  FiUsers,
} from 'react-icons/fi';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {
  FormOptionData,
  ViewPartner,
  ViewCompanyResponse,
  ViewPartnerResponse,
} from '@types';
import {IconType} from 'react-icons';
import {useSearchParams} from 'next/navigation';
import NextLink from 'next/link';
import {useRouter} from 'next/navigation';

const CompanyDetail = ({params}: {params: {id: string}}) => {
  const router = useRouter();
  const statusToast = useToast();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  useEffect(() => {
    switch (status) {
      case 'ACCEPT':
        statusToast({
          title: 'Successfully accepted partnership request',
          status: 'success',
        });
        break;
      case 'DENY':
        statusToast({
          title: 'Successfully denied partnership request',
          status: 'success',
        });
        break;
      case 'ALR_ACCEPT':
        statusToast({
          title: 'Already accepted partnership request',
          status: 'error',
        });
        break;
      case 'ALR_DENY':
        statusToast({
          title: 'Already denied partnership request',
          status: 'error',
        });
        break;
    }
  }, [status]);

  const fetchCompany = async () => {
    const res = await axios.post<ViewCompanyResponse>(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/api/company/detail`,
      params
    );
    return res.data;
  };

  const fetchPartner = async () => {
    const res = await axios.post<ViewPartnerResponse>(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/api/company/partner/view-request`,
      params
    );
    return res.data;
  };

  const makeQuery = () => {
    const company = useQuery({
      queryKey: [`company/${params.id}`],
      queryFn: fetchCompany,
    });
    const partner = useQuery({
      queryKey: [`company/${params.id}/partner`],
      queryFn: fetchPartner,
    });

    return {company, partner};
  };

  const {company: companyResponse, partner: partnerResponse} = makeQuery();

  const {onCopy, hasCopied} = useClipboard(
    partnerResponse?.data?.team?.map(i => i.email_address).join(', ') || ' '
  );

  const [pendingRequest, setPendingRequest] = useState(false);

  const sendPartnershipRequest = async () => {
    if (partnerResponse?.data?.status === 'NO_COMPANY') {
      router.push('/my-company/?no_company=true');
    } else {
      setPendingRequest(true);
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_HOSTNAME}/api/company/partner/request`,
          params
        );
      } catch (e) {
        console.log(e);
      }
    }
  };

  if (companyResponse?.data?.status === 'REDIRECT') {
    router.push('/my-company');
  }

  console.log(partnerResponse.data);
  return (
    <>
      <Container maxW="container.xl" mb="24">
        {/* Loading State */}
        {companyResponse.isLoading && (
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
        {companyResponse.isError && (
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
        {companyResponse.data?.status === 'FOUND' && (
          <Flex
            flexDirection={{base: 'column', lg: 'row'}}
            alignItems="center"
            gap="12"
          >
            <Box mt="14" w={{base: '100%', lg: '50%'}}>
              <Img
                src={companyResponse.data.company.profile}
                maxW={{base: 'auto', sm: '48'}}
                h="12"
                mb="2"
                objectFit="fill"
              />
              <Heading as="h1">
                {companyResponse.data.company.company_name}
              </Heading>
              <Text mt="2" color="brand.400" fontWeight="bold">
                {/*REMOVE SLICE LATER*/}
                {companyResponse.data.company.type_of_business
                  .map(i => i.name)
                  .slice(0, 3)
                  .join(' • ')}
              </Text>
              <Badge
                mt="3"
                fontSize="14"
                whiteSpace="unset"
                colorScheme={
                  companyResponse.data.company.less_than_2_years
                    ? 'gray'
                    : 'brand'
                }
              >
                {companyResponse.data.company.less_than_2_years
                  ? 'Less than 2 years in business'
                  : `${companyResponse.data.company.years_in_business} years in business`}
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
                    {companyResponse.data.company.headquarters_location.label}
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
                  {companyResponse.data.company.operating_regions.map(
                    (i, idx, arr) => (
                      <Text whiteSpace="nowrap" display="inline">
                        {idx === arr.length - 1 ? i : `${i}, `}
                      </Text>
                    )
                  )}
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
                <PartnersDataLine
                  partners={companyResponse.data.company.partners}
                />
                <GenerateDataLine
                  icon={FiRadio}
                  title="Market Focus"
                  arr={companyResponse.data.company.market_focus}
                />
                <GenerateDataLine
                  icon={FiPackage}
                  title="Services"
                  arr={companyResponse.data.company.services}
                />
                <GenerateDataLine
                  icon={FiTool}
                  title="Technologies"
                  arr={companyResponse.data.company.technologies}
                />
              </Flex>
            </Box>
            {partnerResponse.data && (
              <Flex
                justifyContent={{base: 'flex-start', lg: 'center'}}
                w={{base: '100%', lg: '50%'}}
                mb={{base: '0', lg: '44'}}
              >
                {partnerResponse.data.status === 'ACCEPT' ? (
                  <Card variant="outline" p="3" maxW="lg">
                    <CardBody>
                      <Heading size="md" mb="2">
                        Team emails
                      </Heading>
                      <Button
                        size="xs"
                        colorScheme="brand"
                        variant="outline"
                        leftIcon={<Icon as={hasCopied ? FiCheck : FiCopy} />}
                        mb="4"
                        onClick={onCopy}
                      >
                        {hasCopied ? 'Copied' : 'Copy all emails'}
                      </Button>
                      <TableContainer>
                        <Table variant="striped" size="sm">
                          <Thead>
                            <Tr>
                              <Th>Role</Th>
                              <Th>Email</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {partnerResponse?.data?.team?.map(i => (
                              <Tr>
                                <Td>{i.role}</Td>
                                <Td>{i.email_address}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </CardBody>
                  </Card>
                ) : (
                  <Card variant="outline" w="sm" p="3">
                    <CardBody textAlign="center">
                      <Icon
                        as={FiLock}
                        fontSize="32"
                        color="brand.400"
                        mb="2"
                      />
                      <Heading size="md">View Team Emails</Heading>
                      <Text color="gray.500" mt="2" mb="6">
                        Partner with this company to view the email addresses
                        and roles of each member of this company
                      </Text>
                      <Button
                        colorScheme="brand"
                        size={{base: 'sm', md: 'md'}}
                        leftIcon={<Icon as={FiPlusCircle} />}
                        isDisabled={
                          partnerResponse.data.status === 'PENDING' ||
                          pendingRequest
                        }
                        onClick={sendPartnershipRequest}
                      >
                        {partnerResponse.data.status === 'PENDING' ||
                        pendingRequest
                          ? 'Pending Request'
                          : 'Add Partner'}
                      </Button>
                    </CardBody>
                  </Card>
                )}
              </Flex>
            )}
          </Flex>
        )}
      </Container>
    </>
  );
};

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

const PartnersDataLine = ({partners}: {partners: Array<ViewPartner>}) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const CUTOFF = 2;

  if (partners.length === 0) return <></>;

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
          <FiUsers />
          <Text fontWeight="bold" color="gray.500" display="inline">
            Partners:
          </Text>
        </Flex>
        <Box
          color="gray.500"
          display={{base: 'flex', sm: 'inline-block'}}
          flexDirection={{base: 'column', sm: 'row'}}
        >
          {partners.length > CUTOFF ? (
            <Box
              display={{base: 'flex', sm: 'block'}}
              flexDirection="column"
              alignItems="flex-start"
              gap="2"
            >
              {partners.slice(0, CUTOFF).map(i => (
                <Link
                  as={NextLink}
                  href={`/company/detail/${i._id}`}
                  _hover={{textDecoration: 'none'}}
                >
                  <Text
                    display={{base: 'block', sm: 'inline'}}
                    textDecoration="none"
                    color="brand.300"
                    fontWeight="medium"
                    _hover={{color: 'brand.600'}}
                  >
                    {`${i.company_name}, `}
                  </Text>
                </Link>
              ))}
              <Button variant="link" colorScheme="blue" onClick={onOpen}>
                View {partners.length - CUTOFF} more
              </Button>
            </Box>
          ) : (
            <Box
              display={{base: 'flex', sm: 'block'}}
              flexDirection="column"
              alignItems="flex-start"
              gap="2"
            >
              {partners.map((i, idx) => (
                <Link
                  as={NextLink}
                  href={`/company/detail/${i._id}`}
                  _hover={{textDecoration: 'none'}}
                >
                  <Text
                    display={{base: 'block', sm: 'inline'}}
                    textDecoration="none"
                    color="brand.300"
                    fontWeight="medium"
                    _hover={{color: 'brand.600'}}
                  >
                    {idx === partners.length - 1
                      ? i.company_name
                      : `${i.company_name}, `}
                  </Text>
                </Link>
              ))}
            </Box>
          )}
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" alignItems="center" gap="2">
            <FiUsers fontSize="18" />
            Partners
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UnorderedList listStyleType="none" m="0" p="0">
              {partners.map((i, idx) => (
                <>
                  <ListItem my="2">
                    <Link
                      as={NextLink}
                      href={`/company/detail/${i._id}`}
                      _hover={{textDecoration: 'none'}}
                    >
                      <Text
                        textDecoration="none"
                        color="brand.300"
                        fontWeight="medium"
                        _hover={{color: 'brand.600'}}
                      >
                        {i.company_name}
                      </Text>
                      <Text color="gray.500">
                        {i.operating_regions.length} Operating regions
                      </Text>
                    </Link>
                  </ListItem>
                  {idx !== partners.length - 1 && <Divider />}
                </>
              ))}
            </UnorderedList>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CompanyDetail;
