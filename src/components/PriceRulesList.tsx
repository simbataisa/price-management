import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Table, 
  Space, 
  Tag, 
  Popconfirm, 
  Alert, 
  Spin 
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined 
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { PriceRule } from '../types/pricing';
import { priceRulesApi } from '../services/api';

const { Title } = Typography;

const PriceRulesList: React.FC = () => {
  const [rules, setRules] = useState<PriceRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Replace useNavigate with useRouter
  const router = useRouter();

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await priceRulesApi.getAll();
        setRules(response.data);
      } catch (err) {
        setError('Failed to load pricing rules');
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await priceRulesApi.delete(id);
      setRules(rules.filter(rule => rule.id !== id));
    } catch (err) {
      setError('Failed to delete rule');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'percentage' ? 'blue' : type === 'fixed' ? 'green' : 'purple'}>
          {type === 'percentage' ? 'Percentage' : 
           type === 'fixed' ? 'Fixed Amount' : 'Bulk Discount'}
        </Tag>
      ),
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value: number, record: PriceRule) => (
        <span>
          {record.type === 'percentage' ? `${value}%` : `$${value}`}
        </span>
      ),
    },
    {
      title: 'Status',
      key: 'active',
      dataIndex: 'active',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'default'}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => (
        <Tag color="processing">{level}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: PriceRule) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => router.push(`/rules/edit/${record.id}`)}
          />
          <Popconfirm
            title="Are you sure you want to delete this rule?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4}>Pricing Rules</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => router.push('/rules/new')}
        >
          Add New Rule
        </Button>
      </div>

      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 24 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table 
          columns={columns} 
          dataSource={rules} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </Card>
  );
};

export default PriceRulesList;