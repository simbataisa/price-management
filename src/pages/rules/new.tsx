import type { NextPage } from 'next';
import Head from 'next/head';
import PricingConfig from '../../components/PricingConfig';

const NewRulePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>New Price Rule - Trae Project</title>
        <meta name="description" content="Create a new price rule" />
      </Head>
      <PricingConfig />
    </>
  );
};

export default NewRulePage;