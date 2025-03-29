import React from 'react';
import type { AppProps } from 'next/app';
import { Layout, Menu, Typography, Spin } from 'antd';
import {
  CalculatorOutlined,
  TagOutlined,
  GiftOutlined,
  AppstoreAddOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { LoadingProvider } from '../contexts/LoadingContext';
import '../styles/globals.css';

const { Header, Content } = Layout;
const { Title } = Typography;

// Create a separate component for the app content to use the context safely
function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { isLoading } = useLoading();
  const [current, setCurrent] = React.useState(() => {
    if (router.pathname.includes('/vouchers')) return 'vouchers';
    if (router.pathname.includes('/combos')) return 'combos';
    if (router.pathname.includes('/rules')) return 'rules';
    return 'calculator';
  });

  const handleMenuClick = (e: { key: string }) => {
    setCurrent(e.key);
    
    // Navigate based on menu key
    switch (e.key) {
      case 'calculator':
        router.push('/');
        break;
      case 'rules':
        router.push('/rules');
        break;
      case 'vouchers':
        router.push('/vouchers');
        break;
      case 'combos':
        router.push('/combos');
        break;
      default:
        router.push('/');
    }
  };

  const menuItems = [
    {
      label: 'Calculator',
      key: 'calculator',
      icon: <CalculatorOutlined />
    },
    {
      label: 'Price Rules',
      key: 'rules',
      icon: <TagOutlined />
    },
    {
      label: 'Vouchers',
      key: 'vouchers',
      icon: <GiftOutlined />
    },
    {
      label: 'Combos',
      key: 'combos',
      icon: <AppstoreAddOutlined />
    }
  ];

  return (
    <LoadingProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#fff', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Title level={4} style={{ margin: '0 24px 0 0' }}>Pricing Management</Title>
            <Menu
              onClick={handleMenuClick}
              selectedKeys={[current]}
              mode="horizontal"
              items={menuItems}
              style={{ flex: 1 }}
            />
          </div>
        </Header>
        <Content style={{ padding: '24px 50px', maxWidth: '1200px', margin: '0 auto' }}>
          <LoadingSpinner>
            <Component {...pageProps} />
          </LoadingSpinner>
        </Content>
      </Layout>
    </LoadingProvider>
  );
}

function MyApp(props: AppProps) {
  // Move the router outside the context
  const router = useRouter();
  const [current, setCurrent] = React.useState(() => {
    if (router.pathname.includes('/vouchers')) return 'vouchers';
    if (router.pathname.includes('/combos')) return 'combos';
    if (router.pathname.includes('/rules')) return 'rules';
    return 'calculator';
  });

  const handleMenuClick = (e: { key: string }) => {
    setCurrent(e.key);
    
    // Navigate based on menu key
    switch (e.key) {
      case 'calculator':
        router.push('/');
        break;
      case 'rules':
        router.push('/rules');
        break;
      case 'vouchers':
        router.push('/vouchers');
        break;
      case 'combos':
        router.push('/combos');
        break;
      default:
        router.push('/');
    }
  };

  const menuItems = [
    {
      label: 'Calculator',
      key: 'calculator',
      icon: <CalculatorOutlined />
    },
    {
      label: 'Price Rules',
      key: 'rules',
      icon: <TagOutlined />
    },
    {
      label: 'Vouchers',
      key: 'vouchers',
      icon: <GiftOutlined />
    },
    {
      label: 'Combos',
      key: 'combos',
      icon: <AppstoreAddOutlined />
    }
  ];

  return (
    <LoadingProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#fff', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Title level={4} style={{ margin: '0 24px 0 0' }}>Pricing Management</Title>
            <Menu
              onClick={handleMenuClick}
              selectedKeys={[current]}
              mode="horizontal"
              items={menuItems}
              style={{ flex: 1 }}
            />
          </div>
        </Header>
        <Content style={{ padding: '24px 50px', maxWidth: '1200px', margin: '0 auto' }}>
          <LoadingSpinner>
            <props.Component {...props.pageProps} />
          </LoadingSpinner>
        </Content>
      </Layout>
    </LoadingProvider>
  );
}

// Create a separate component for the loading spinner
function LoadingSpinner({ children }: { children: React.ReactNode }) {
  // This hook is safely used within the LoadingProvider
  const { isLoading } = useLoading();
  
  return (
    <Spin spinning={isLoading} size="large">
      {children}
    </Spin>
  );
}

// Import the hook here to avoid circular dependencies
import { useLoading } from '../contexts/LoadingContext';

export default MyApp;