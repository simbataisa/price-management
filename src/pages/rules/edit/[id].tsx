import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PricingConfig from '../../../components/PricingConfig';

const EditRulePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Edit Price Rule - Trae Project</title>
        <meta name="description" content="Edit an existing price rule" />
      </Head>
      {id && <PricingConfig />}
    </>
  );
};

export default EditRulePage;