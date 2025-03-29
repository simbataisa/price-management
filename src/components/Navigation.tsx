import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const { Header } = Layout;
const { Title } = Typography;

const Navigation = () => {
  const location = useLocation();
  
  // Determine which menu item should be active based on current path
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/create')) return '2';
    if (path.includes('/calculator')) return '3';
    return '1'; // Default to Rules List
  };

  return (
    <Header style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: '0 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <Title level={4} style={{ margin: 0, marginRight: 'auto' }}>
        Pricing System
      </Title>
      <Menu
        mode="horizontal"
        selectedKeys={[getSelectedKey()]}
        style={{ border: 'none', minWidth: '400px' }}
      >
        <Menu.Item key="1">
          <Link to="/">Rules List</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/create">Create Rule</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/calculator">Calculator</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default Navigation;