import type { NextPage } from 'next';
import Head from 'next/head';
import ComboList from '../../components/combo/ComboList';

const CombosPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Combos - Trae Project</title>
        <meta name="description" content="Manage combo packages" />
      </Head>
      <ComboList />
    </>
  );
};

export default CombosPage;