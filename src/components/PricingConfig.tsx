import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Input,
  Button,
  Select,
  Form,
  Alert,
  Switch,
  Divider,
  DatePicker,
  Space,
  InputNumber,
  Row,
  Col,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { PriceRule } from '../types/pricing';
import { priceRulesApi } from '../services/api';
import { useRouter } from 'next/router';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const PricingConfig: React.FC = () => {
  const [priceRule, setPriceRule] = useState<Partial<PriceRule>>({
    type: 'percentage',
    active: true,
    priority: 1,
    level: 'global',
    stackable: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Replace useNavigate and useParams with useRouter
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      const fetchRule = async () => {
        try {
          const response = await priceRulesApi.getById(id as string);
          setPriceRule(response.data);
          form.setFieldsValue(response.data);
        } catch (err) {
          setError('Failed to load rule details');
        }
      };
      fetchRule();
    }
  }, [id, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setError(null);
    
    try {
      if (id) {
        await priceRulesApi.update(id as string, values);
      } else {
        await priceRulesApi.create(values);
      }
      router.push('/rules');
    } catch (err) {
      setError('Failed to save rule. Please try again.');
    } finally {
      setLoading(false);
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
            onClick={() => router.push('/rules')}
          >
            Back to Rules
          </Button>
          <Title level={4} style={{ margin: 0 }}>{id ? 'Edit' : 'Create'} Price Rule</Title>
          <div style={{ width: 80 }}></div> {/* Spacer for alignment */}
        </div>
        
        {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={priceRule}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} lg={16}>
              <Card title="Basic Information" bordered={false}>
                <Row gutter={16}>
                  <Col xs={24}>
                    <Form.Item
                      name="name"
                      label="Rule Name"
                      rules={[{ required: true, message: 'Name is required' }]}
                    >
                      <Input placeholder="Enter rule name" />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24}>
                    <Form.Item
                      name="description"
                      label="Description"
                    >
                      <TextArea rows={2} placeholder="Enter description" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              
              <Card title="Rule Configuration" bordered={false} style={{ marginTop: 16 }}>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="type"
                      label="Rule Type"
                      rules={[{ required: true, message: 'Please select rule type' }]}
                    >
                      <Select>
                        <Option value="percentage">Percentage Discount</Option>
                        <Option value="fixed">Fixed Amount</Option>
                        <Option value="bulk">Bulk Discount</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="value"
                      label="Value"
                      rules={[
                        { required: true, message: 'Value is required' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || value <= 0) {
                              return Promise.reject('Value must be greater than 0');
                            }
                            if (getFieldValue('type') === 'percentage' && value > 100) {
                              return Promise.reject('Percentage cannot exceed 100%');
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="startDate"
                      label="Start Date"
                    >
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="endDate"
                      label="End Date"
                    >
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>
            
            <Col xs={24} lg={8}>
              <Card title="Advanced Settings" bordered={false}>
                <Form.Item
                  name="active"
                  label="Status"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>
                
                <Form.Item
                  name="stackable"
                  label="Stackable with other rules"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
                
                <Form.Item
                  name="priority"
                  label="Priority"
                  tooltip="Lower number = higher priority"
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                
                <Form.Item
                  name="level"
                  label="Rule Level"
                >
                  <Select style={{ width: '100%' }}>
                    <Option value="global">Global</Option>
                    <Option value="customer">Customer</Option>
                    <Option value="product">Product</Option>
                    <Option value="item">Item</Option>
                    <Option value="service">Service</Option>
                  </Select>
                </Form.Item>
              </Card>
              
              <Card title="Actions" bordered={false} style={{ marginTop: 16 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    style={{ width: '100%' }}
                  >
                    {id ? 'Update' : 'Create'} Rule
                  </Button>
                  <Button 
                    onClick={() => router.push('/rules')}
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

export default PricingConfig;