import type { NextPage } from 'next';
import Head from 'next/head';
import VoucherList from '../../components/voucher/VoucherList';

const VouchersPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Vouchers - Trae Project</title>
        <meta name="description" content="Manage vouchers" />
      </Head>
      <VoucherList />
    </>
  );
};

export default VouchersPage;