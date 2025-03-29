import type { NextPage } from 'next';
import Head from 'next/head';
import PriceCalculator from '../../components/PriceCalculator';

const PricingPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Pricing Calculator - Trae Project</title>
        <meta name="description" content="Calculate prices with various rules and conditions" />
      </Head>

      <main style={{ padding: '20px' }}>
        <PriceCalculator />
      </main>
    </div>
  );
};

export default PricingPage;