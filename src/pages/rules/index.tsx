import type { NextPage } from 'next';
import Head from 'next/head';
import PriceRulesList from '../../components/PriceRulesList';

const RulesPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Price Rules - Trae Project</title>
        <meta name="description" content="Manage price rules" />
      </Head>
      <PriceRulesList />
    </>
  );
};

export default RulesPage;