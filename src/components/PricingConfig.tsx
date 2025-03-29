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
} from 'antd';
import { PriceRule } from '../types/pricing';
import { priceRulesApi } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

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
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      const fetchRule = async () => {
        try {
          const response = await priceRulesApi.getById(id);
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
        await priceRulesApi.update(id, values);
      } else {
        await priceRulesApi.create(values as Omit<PriceRule, 'id'>);
      }
      navigate('/');
    } catch (err) {
      setError('Failed to save price rule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
      <Title level={5}>{id ? 'Edit' : 'Create'} Price Rule</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={priceRule}
      >
        <Form.Item
          name="name"
          label="Rule Name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input placeholder="Enter rule name" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea rows={2} placeholder="Enter description" />
        </Form.Item>

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

        <Space style={{ display: 'flex', marginBottom: 16 }}>
          <Form.Item
            name="startDate"
            label="Start Date"
          >
            <DatePicker />
          </Form.Item>
          
          <Form.Item
            name="endDate"
            label="End Date"
          >
            <DatePicker />
          </Form.Item>
        </Space>

        <Divider>Advanced Settings</Divider>

        <Space style={{ display: 'flex', marginBottom: 16 }}>
          <Form.Item
            name="active"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
          
          <Text>Active</Text>
        </Space>

        <Space style={{ display: 'flex', marginBottom: 16 }}>
          <Form.Item
            name="stackable"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          
          <Text>Stackable with other rules</Text>
        </Space>

        <Space style={{ display: 'flex', marginBottom: 16 }}>
          <Form.Item
            name="priority"
            label="Priority"
            tooltip="Lower number = higher priority"
          >
            <InputNumber min={0} style={{ width: 120 }} />
          </Form.Item>
          
          <Form.Item
            name="level"
            label="Rule Level"
          >
            <Select style={{ width: 200 }}>
              <Option value="global">Global</Option>
              <Option value="customer">Customer</Option>
              <Option value="product">Product</Option>
              <Option value="item">Item</Option>
              <Option value="service">Service</Option>
            </Select>
          </Form.Item>
        </Space>

        <Form.Item>
          <Space>
            <Button onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {id ? 'Update' : 'Create'} Rule
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PricingConfig;