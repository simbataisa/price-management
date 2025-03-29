import type { NextPage } from 'next';
import Head from 'next/head';
import ComboConfig from '../../components/combo/ComboConfig';

const NewComboPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>New Combo - Trae Project</title>
        <meta name="description" content="Create a new combo package" />
      </Head>
      <ComboConfig />
    </>
  );
};

export default NewComboPage;