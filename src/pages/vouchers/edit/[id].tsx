import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import VoucherConfig from '../../../components/voucher/VoucherConfig';

const EditVoucherPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Edit Voucher - Trae Project</title>
        <meta name="description" content="Edit an existing voucher" />
      </Head>
      {id && <VoucherConfig />}
    </>
  );
};

export default EditVoucherPage;