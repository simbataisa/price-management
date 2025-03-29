import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ComboConfig from '../../../components/combo/ComboConfig';

const EditComboPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Edit Combo - Trae Project</title>
        <meta name="description" content="Edit an existing combo package" />
      </Head>
      {id && <ComboConfig />}
    </>
  );
};

export default EditComboPage;