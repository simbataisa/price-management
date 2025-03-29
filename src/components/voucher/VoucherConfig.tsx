import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Input,
  Button,
  Select,
  Form,
  Alert,
  Spin,
  Switch,
  Divider,
  Row,
  Col,
  DatePicker,
  InputNumber,
  Tag,
  Space,
} from 'antd';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

interface Voucher {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchaseAmount?: number;
  maxUsage?: number;
  usageCount: number;
  startDate?: Date | dayjs.Dayjs; // Update to accept both Date and dayjs
  endDate?: Date | dayjs.Dayjs;   // Update to accept both Date and dayjs
  active: boolean;
  customerRestriction?: 'new' | 'existing' | 'all';
  productRestriction?: string[];
  categoryRestriction?: string[];
  stackable: boolean;
  stackPriority?: number;
  applicableServices?: string[];
  applicableAddOns?: string[];
}

// Mock API for vouchers
const voucherApi = {
  getById: (id: string) => Promise.resolve({ 
    data: {
      id,
      code: 'SAMPLE10',
      description: 'Sample voucher',
      type: 'percentage',
      value: 10,
      minPurchaseAmount: 100,
      maxUsage: 1,
      usageCount: 0,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      active: true,
      customerRestriction: 'all',
    } as Voucher
  }),
  create: (voucher: Omit<Voucher, 'id'>) => 
    Promise.resolve({ data: { ...voucher, id: Date.now().toString() } }),
  update: (id: string, voucher: Partial<Voucher>) => 
    Promise.resolve({ data: { ...voucher, id } }),
};

// Mock data for services and add-ons
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

const VoucherConfig: React.FC = () => {
  const [form] = Form.useForm();
  const [voucher, setVoucher] = useState<Partial<Voucher>>({
    type: 'percentage',
    active: true,
    usageCount: 0,
    customerRestriction: 'all',
    stackable: true,
    stackPriority: 1,
    applicableServices: [],
    applicableAddOns: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchVoucher = async () => {
        try {
          const response = await voucherApi.getById(id as string);
          const data = response.data;
          
          // Convert dates to dayjs for Ant Design DatePicker
          const formattedData = {
            ...data,
            startDate: data.startDate ? dayjs(data.startDate) : undefined,
            endDate: data.endDate ? dayjs(data.endDate) : undefined,
          };
          
          setVoucher(formattedData);
          form.setFieldsValue(formattedData);
        } catch (err) {
          setError('Failed to load voucher details');
        }
      };
      fetchVoucher();
    }
  }, [id, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert dayjs objects back to Date
      const formattedValues = {
        ...values,
        startDate: values.startDate ? values.startDate.toDate() : undefined,
        endDate: values.endDate ? values.endDate.toDate() : undefined,
      };
      
      if (id) {
        await voucherApi.update(id as string, formattedValues);
      } else {
        await voucherApi.create(formattedValues as Omit<Voucher, 'id'>);
      }
      router.push('/vouchers');
    } catch (err) {
      setError('Failed to save voucher. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
      <Title level={5}>{id ? 'Edit' : 'Create'} Voucher</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={voucher}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="code"
              label="Voucher Code"
              rules={[{ required: true, message: 'Voucher code is required' }]}
            >
              <Input 
                onChange={(e) => form.setFieldValue('code', e.target.value.toUpperCase())}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item
              name="type"
              label="Voucher Type"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="percentage">Percentage Discount</Option>
                <Option value="fixed">Fixed Amount</Option>
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
              extra={form.getFieldValue('type') === 'percentage' ? 'Percentage value (0-100)' : 'Amount in currency'}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item
              name="minPurchaseAmount"
              label="Minimum Purchase Amount"
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item
              name="maxUsage"
              label="Maximum Usage"
              extra="Leave empty for unlimited usage"
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item
              name="usageCount"
              label="Current Usage Count"
              extra="Number of times this voucher has been used"
            >
              <InputNumber 
                style={{ width: '100%' }} 
                disabled={!id}
              />
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

        <Divider />
        <Title level={5}>Restrictions</Title>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="customerRestriction"
              label="Customer Restriction"
            >
              <Select>
                <Option value="all">All Customers</Option>
                <Option value="new">New Customers Only</Option>
                <Option value="existing">Existing Customers Only</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item
              name="stackable"
              label="Stackable with other vouchers/discounts"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          
          {form.getFieldValue('stackable') && (
            <Col xs={24} md={12}>
              <Form.Item
                name="stackPriority"
                label="Stack Priority"
                extra="Lower number = higher priority (applied first)"
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  min={1}
                />
              </Form.Item>
            </Col>
          )}
          
          <Col xs={24}>
            <Form.Item
              name="active"
              label="Active"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Divider />
        <Title level={5}>Applicable Services & Add-ons</Title>
        <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
          If none selected, voucher applies to all services and add-ons
        </Text>
        
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="applicableServices"
              label="Applicable Services"
            >
              <Select
                mode="multiple"
                placeholder="Select services"
                style={{ width: '100%' }}
                tagRender={(props) => {
                  const service = availableServices.find(s => s.id === props.value);
                  return (
                    <Tag closable={props.closable} onClose={props.onClose}>
                      {service ? service.name : props.value}
                    </Tag>
                  );
                }}
              >
                {availableServices.map((service) => (
                  <Option key={service.id} value={service.id}>
                    {service.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item
              name="applicableAddOns"
              label="Applicable Add-ons"
            >
              <Select
                mode="multiple"
                placeholder="Select add-ons"
                style={{ width: '100%' }}
                tagRender={(props) => {
                  const addon = availableAddOns.find(a => a.id === props.value);
                  return (
                    <Tag closable={props.closable} onClose={props.onClose}>
                      {addon ? addon.name : props.value}
                    </Tag>
                  );
                }}
              >
                {availableAddOns.map((addon) => (
                  <Option key={addon.id} value={addon.id}>
                    {addon.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: 24 }}>
          <Space>
            <Button onClick={() => router.push('/vouchers')}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {id ? 'Update' : 'Create'} Voucher
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default VoucherConfig;