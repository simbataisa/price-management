import type { NextPage } from 'next';
import Head from 'next/head';
import PriceCalculator from '../components/PriceCalculator';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Price Calculator - Trae Project</title>
        <meta name="description" content="Calculate prices with various rules and conditions" />
      </Head>
      <PriceCalculator />
    </>
  );
};

export default Home;