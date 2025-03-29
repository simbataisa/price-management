import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Button,
  Table,
  Tag,
  Space,
  Popconfirm,
  Alert,
  Spin
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useLoading } from '../../contexts/LoadingContext';
import { useRouter } from 'next/router';

interface ComboItem {
  productId: string;
  quantity: number;
}

interface Combo {
  id: string;
  name: string;
  description: string;
  items: ComboItem[];
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate?: Date;
  endDate?: Date;
  active: boolean;
  minDuration?: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
}

// Mock products data
const mockProducts: Product[] = [
  { id: 'car1', name: 'Economy Car', description: 'Small economy car', basePrice: 50, category: 'car' },
  { id: 'car2', name: 'SUV', description: 'Sport utility vehicle', basePrice: 80, category: 'car' },
  { id: 'car3', name: 'Luxury Sedan', description: 'Premium sedan', basePrice: 120, category: 'car' },
  { id: 'service1', name: 'GPS Navigation', description: 'GPS navigation system', basePrice: 10, category: 'service' },
  { id: 'service2', name: 'Child Seat', description: 'Child safety seat', basePrice: 15, category: 'service' },
  { id: 'service3', name: 'Additional Driver', description: 'Additional driver service', basePrice: 20, category: 'service' },
];

// Mock combos data
const mockCombos: Combo[] = [
  {
    id: '1',
    name: 'Family Package',
    description: 'SUV with child seat and GPS',
    items: [
      { productId: 'car2', quantity: 1 },
      { productId: 'service1', quantity: 1 },
      { productId: 'service2', quantity: 1 },
    ],
    discountType: 'percentage',
    discountValue: 15,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    active: true,
    minDuration: 3,
  },
  {
    id: '2',
    name: 'Business Trip',
    description: 'Luxury sedan with GPS and additional driver',
    items: [
      { productId: 'car3', quantity: 1 },
      { productId: 'service1', quantity: 1 },
      { productId: 'service3', quantity: 1 },
    ],
    discountType: 'fixed',
    discountValue: 30,
    active: true,
  },
  {
    id: '3',
    name: 'Economy Special',
    description: 'Economy car with GPS',
    items: [
      { productId: 'car1', quantity: 1 },
      { productId: 'service1', quantity: 1 },
    ],
    discountType: 'percentage',
    discountValue: 10,
    active: false,
  },
];

const { Title } = Typography;

const ComboList: React.FC = () => {
  const [combos, setCombos] = useState<Combo[]>(mockCombos);
  const [error, _setError] = useState<string | null>(null);
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();
  
  // Keep the useEffect for hiding loading
  useEffect(() => {
    return () => {
      hideLoading();
    };
  }, [hideLoading]);

  // Update navigation functions to show loading
  const handleNavigate = (path: string) => {
    showLoading();
    setTimeout(() => {
      router.push(path);
    }, 300);
  };

  const handleDelete = (id: string) => {
    showLoading();
    setTimeout(() => {
      setCombos(combos.filter(combo => combo.id !== id));
      hideLoading();
    }, 300);
  };

  // Keep utility functions
  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const getProductName = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const calculateTotalPrice = (combo: Combo) => {
    return combo.items.reduce((total, item) => {
      const product = mockProducts.find(p => p.id === item.productId);
      return total + (product ? product.basePrice * item.quantity : 0);
    }, 0);
  };

  const calculateDiscountedPrice = (combo: Combo) => {
    const totalPrice = calculateTotalPrice(combo);
    
    if (combo.discountType === 'percentage') {
      return totalPrice * (1 - combo.discountValue / 100);
    } else {
      return Math.max(0, totalPrice - combo.discountValue);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Define columns for Ant Design Table
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      responsive: ['sm'],
      render: (text: string) => truncateText(text, 50),
    },
    {
      title: 'Price',
      key: 'price',
      render: (_: any, record: Combo) => (
        <span>${calculateDiscountedPrice(record).toFixed(2)}</span>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      responsive: ['md'],
      render: (_: any, record: Combo) => (
        <Tag color={record.active ? 'success' : 'default'}>
          {record.active ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: Combo) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleNavigate(`/combos/edit/${record.id}`)}
          />
          <Popconfirm
            title="Are you sure you want to delete this combo?"
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
        <Title level={4}>Combo Packages</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => handleNavigate('/combos/new')}
        >
          New Combo
        </Button>
      </div>

      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}

      <Table 
        columns={columns} 
        dataSource={combos} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default ComboList;