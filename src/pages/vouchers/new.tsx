import type { NextPage } from 'next';
import Head from 'next/head';
import VoucherConfig from '../../components/voucher/VoucherConfig';

const NewVoucherPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>New Voucher - Trae Project</title>
        <meta name="description" content="Create a new voucher" />
      </Head>
      <VoucherConfig />
    </>
  );
};

export default NewVoucherPage;