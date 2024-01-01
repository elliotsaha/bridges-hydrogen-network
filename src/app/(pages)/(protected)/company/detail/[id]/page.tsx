'use client';
import {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {Company} from '@models';
import axios from 'axios';

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

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default CompanyDetail;
