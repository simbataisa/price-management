import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Select,
  Alert,
  Switch,
  Divider,
  DatePicker,
  InputNumber,
  List,
  Space,
  Statistic,
  Row,
  Col
} from 'antd';
import { DeleteOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

// Keep all the interfaces and mock data the same
interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
}

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
  stackable: boolean;
  stackPriority?: number;
  applicableServices?: string[];
  applicableAddOns?: string[];
}

// Keep the mock data
const mockProducts: Product[] = [
  { id: 'car1', name: 'Economy Car', description: 'Small economy car', basePrice: 50, category: 'car' },
  { id: 'car2', name: 'SUV', description: 'Sport utility vehicle', basePrice: 80, category: 'car' },
  { id: 'car3', name: 'Luxury Sedan', description: 'Premium sedan', basePrice: 120, category: 'car' },
  { id: 'service1', name: 'GPS Navigation', description: 'GPS navigation system', basePrice: 10, category: 'service' },
  { id: 'service2', name: 'Child Seat', description: 'Child safety seat', basePrice: 15, category: 'service' },
  { id: 'service3', name: 'Additional Driver', description: 'Additional driver service', basePrice: 20, category: 'service' },
];

// Keep the mock API
const comboApi = {
  getById: (id: string) => Promise.resolve({ 
    data: {
      id,
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
    } as Combo
  }),
  create: (combo: Omit<Combo, 'id'>) => 
    Promise.resolve({ data: { ...combo, id: Date.now().toString() } }),
  update: (id: string, combo: Partial<Combo>) => 
    Promise.resolve({ data: { ...combo, id } }),
};

// Keep the mock data arrays
const availableServices = [
  { id: 'service1', name: 'GPS Navigation', category: 'electronics' },
  { id: 'service2', name: 'Child Seat', category: 'safety' },
  { id: 'service3', name: 'Additional Driver', category: 'personnel' },
  { id: 'service4', name: 'Roadside Assistance', category: 'safety' },
  { id: 'service5', name: 'Wifi Hotspot', category: 'electronics' },
];

const availableAddOns = [
  { id: 'addon1', name: 'Full Insurance Coverage', category: 'insurance' },
  { id: 'addon2', name: 'Fuel Pre-purchase', category: 'fuel' },
  { id: 'addon3', name: 'Airport Pickup', category: 'convenience' },
  { id: 'addon4', name: 'Late Return', category: 'flexibility' },
  { id: 'addon5', name: 'One-way Rental', category: 'flexibility' },
];

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const ComboConfig: React.FC = () => {
  const [combo, setCombo] = useState<Partial<Combo>>({
    discountType: 'percentage',
    discountValue: 10,
    active: true,
    items: [],
    stackable: true,
    stackPriority: 1,
    applicableServices: [],
    applicableAddOns: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = router.query;
  
  // For adding new items
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      const fetchCombo = async () => {
        try {
          const response = await comboApi.getById(id as string);
          setCombo(response.data);
          form.setFieldsValue({
            ...response.data,
            dateRange: response.data.startDate && response.data.endDate ? 
              [dayjs(response.data.startDate), dayjs(response.data.endDate)] : undefined
          });
        } catch (err) {
          setError('Failed to load combo details');
        }
      };
      fetchCombo();
    }
  }, [id, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setError(null);
    
    try {
      // Extract dates from the range picker
      const dateRange = values.dateRange;
      const startDate = dateRange?.[0]?.toDate();
      const endDate = dateRange?.[1]?.toDate();
      
      // Prepare the combo data
      const comboData = {
        ...values,
        startDate,
        endDate,
        items: combo.items, // Use the items from state
      };
      
      // Remove the dateRange field
      delete comboData.dateRange;
      
      if (id) {
        await comboApi.update(id as string, comboData);
      } else {
        await comboApi.create(comboData as Omit<Combo, 'id'>);
      }
      router.push('/combos');
    } catch (err) {
      setError('Failed to save combo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    if (!selectedProduct) return;
    
    const items = [...(combo.items || [])];
    const existingItemIndex = items.findIndex(item => item.productId === selectedProduct);
    
    if (existingItemIndex >= 0) {
      items[existingItemIndex].quantity += quantity;
    } else {
      items.push({ productId: selectedProduct, quantity });
    }
    
    setCombo({ ...combo, items });
    setSelectedProduct('');
    setQuantity(1);
  };

  const removeItem = (productId: string) => {
    const items = (combo.items || []).filter(item => item.productId !== productId);
    setCombo({ ...combo, items });
  };

  const getProductName = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const calculateTotalPrice = () => {
    if (!combo.items || combo.items.length === 0) return 0;
    
    return combo.items.reduce((total, item) => {
      const product = mockProducts.find(p => p.id === item.productId);
      return total + (product ? product.basePrice * item.quantity : 0);
    }, 0);
  };

  const calculateDiscountedPrice = () => {
    const totalPrice = calculateTotalPrice();
    
    if (combo.discountType === 'percentage') {
      return totalPrice * (1 - (combo.discountValue || 0) / 100);
    } else {
      return Math.max(0, totalPrice - (combo.discountValue || 0));
    }
  };

  return (
    <div className="config-container" style={{ 
      maxWidth: '1200px', 
      margin: '0 auto'
    }}>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.push('/combos')}
          >
            Back to Combos
          </Button>
          <Title level={4} style={{ margin: 0 }}>{id ? 'Edit' : 'Create'} Combo Package</Title>
          <div style={{ width: 80 }}></div> {/* Spacer for alignment */}
        </div>
        
        {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            ...combo,
            dateRange: combo.startDate && combo.endDate ? 
              [dayjs(combo.startDate), dayjs(combo.endDate)] : undefined
          }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} lg={16}>
              <Card title="Basic Information" bordered={false}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={16}>
                    <Form.Item
                      name="name"
                      label="Combo Name"
                      rules={[{ required: true, message: 'Please enter a combo name' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="active"
                      label="Status"
                      valuePropName="checked"
                    >
                      <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24}>
                    <Form.Item
                      name="description"
                      label="Description"
                    >
                      <TextArea rows={3} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              
              <Card title="Discount Settings" bordered={false} style={{ marginTop: 16 }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="discountType"
                      label="Discount Type"
                      rules={[{ required: true }]}
                    >
                      <Select>
                        <Select.Option value="percentage">Percentage Discount</Select.Option>
                        <Select.Option value="fixed">Fixed Amount</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="discountValue"
                      label="Discount Value"
                      rules={[
                        { required: true, message: 'Please enter discount value' },
                        {
                          validator: (_, value) => {
                            if (value <= 0) {
                              return Promise.reject('Value must be greater than 0');
                            }
                            if (combo.discountType === 'percentage' && value > 100) {
                              return Promise.reject('Percentage cannot exceed 100%');
                            }
                            return Promise.resolve();
                          }
                        }
                      ]}
                    >
                      <InputNumber 
                        style={{ width: '100%' }} 
                        min={0} 
                        max={combo.discountType === 'percentage' ? 100 : undefined}
                        addonAfter={combo.discountType === 'percentage' ? '%' : '$'}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="dateRange"
                      label="Valid Period"
                    >
                      <RangePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="minDuration"
                      label="Minimum Duration (days)"
                    >
                      <InputNumber style={{ width: '100%' }} min={1} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              
              <Card title="Combo Items" bordered={false} style={{ marginTop: 16 }}>
                {(!combo.items || combo.items.length === 0) && (
                  <Alert 
                    message="At least one product must be added to the combo" 
                    type="warning" 
                    style={{ marginBottom: 16 }} 
                  />
                )}
                
                <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                  <Col xs={24} md={14}>
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Select a product"
                      value={selectedProduct}
                      onChange={setSelectedProduct}
                    >
                      <Select.OptGroup label="Cars">
                        {mockProducts.filter(p => p.category === 'car').map(product => (
                          <Select.Option key={product.id} value={product.id}>
                            {product.name} (${product.basePrice})
                          </Select.Option>
                        ))}
                      </Select.OptGroup>
                      <Select.OptGroup label="Services">
                        {mockProducts.filter(p => p.category === 'service').map(product => (
                          <Select.Option key={product.id} value={product.id}>
                            {product.name} (${product.basePrice})
                          </Select.Option>
                        ))}
                      </Select.OptGroup>
                    </Select>
                  </Col>
                  
                  <Col xs={10} md={5}>
                    <InputNumber
                      min={1}
                      value={quantity}
                      onChange={value => setQuantity(value || 1)}
                      style={{ width: '100%' }}
                      placeholder="Qty"
                    />
                  </Col>
                  
                  <Col xs={14} md={5}>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={addItem}
                      disabled={!selectedProduct}
                      style={{ width: '100%' }}
                    >
                      Add
                    </Button>
                  </Col>
                </Row>
                
                <List
                  bordered
                  dataSource={combo.items || []}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Button 
                          key="delete" 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />} 
                          onClick={() => removeItem(item.productId)}
                        />
                      ]}
                    >
                      <List.Item.Meta
                        title={getProductName(item.productId)}
                        description={`Quantity: ${item.quantity}`}
                      />
                    </List.Item>
                  )}
                  locale={{ emptyText: "No items added to this combo yet" }}
                  style={{ marginBottom: 16 }}
                />
              </Card>
            </Col>
            
            <Col xs={24} lg={8}>
              <Card title="Pricing Summary" bordered={false}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Statistic 
                      title="Regular Price" 
                      value={calculateTotalPrice()} 
                      precision={2} 
                      prefix="$" 
                    />
                  </Col>
                  <Col span={24}>
                    <Statistic 
                      title="Combo Price" 
                      value={calculateDiscountedPrice()} 
                      precision={2} 
                      prefix="$" 
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Col>
                  <Col span={24}>
                    <Statistic 
                      title="Savings" 
                      value={calculateTotalPrice() - calculateDiscountedPrice()} 
                      precision={2} 
                      prefix="$" 
                      suffix={combo.discountType === 'percentage' ? `(${combo.discountValue}%)` : ''}
                      valueStyle={{ color: '#cf1322' }}
                    />
                  </Col>
                </Row>
              </Card>
              
              <Card title="Actions" bordered={false} style={{ marginTop: 16 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    disabled={!combo.items || combo.items.length === 0}
                    style={{ width: '100%' }}
                  >
                    {id ? 'Update' : 'Create'} Combo
                  </Button>
                  <Button 
                    onClick={() => router.push('/combos')}
                    style={{ width: '100%' }}
                  >
                    Cancel
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default ComboConfig;