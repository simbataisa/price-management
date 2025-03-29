import React from 'react';
import {
  Typography,
  Form,
  Input,
  Select,
  Radio,
  InputNumber,
  Space,
  Card,
  Row,
  Col
} from 'antd';
import { CarOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';

interface CarModel {
  id: string;
  name: string;
  basePrice: number;
}

interface RentalOptionsProps {
  rentalType: 'short-term' | 'long-term';
  setRentalType: (type: 'short-term' | 'long-term') => void;
  carDetails: {
    model: string;
    year: number;
    mileage: number;
  };
  setCarDetails: (details: any) => void;
  duration: number;
  setDuration: (duration: number) => void;
  route: string;
  setRoute: (route: string) => void;
  customerType: string;
  setCustomerType: (type: string) => void;
  carQuantity: number;
  setCarQuantity: (quantity: number) => void;
  carModels: CarModel[];
}

const { Title } = Typography;
const { Option } = Select;

const RentalOptions: React.FC<RentalOptionsProps> = ({
  rentalType,
  setRentalType,
  carDetails,
  setCarDetails,
  duration,
  setDuration,
  route,
  setRoute,
  customerType,
  setCustomerType,
  carQuantity,
  setCarQuantity,
  carModels
}) => {
  return (
    <>
      <Title level={5}>
        <CarOutlined /> Car Rental Price Calculator
      </Title>
      
      <Radio.Group
        value={rentalType}
        onChange={(e) => setRentalType(e.target.value)}
        style={{ marginBottom: 16, width: '100%' }}
        buttonStyle="solid"
      >
        <Radio.Button value="short-term" style={{ width: '50%', textAlign: 'center' }}>
          Short-term Rental
        </Radio.Button>
        <Radio.Button value="long-term" style={{ width: '50%', textAlign: 'center' }}>
          Long-term Leasing
        </Radio.Button>
      </Radio.Group>
      
      <Form layout="vertical">
        <Form.Item label="Car Model">
          <Select
            value={carDetails.model.toLowerCase()}
            onChange={(value) => setCarDetails({
              ...carDetails,
              model: value
            })}
            style={{ width: '100%' }}
          >
            {carModels.map(model => (
              <Option key={model.id} value={model.id}>
                {model.name} (${model.basePrice}/{rentalType === 'short-term' ? 'day' : 'month'})
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Year">
              <InputNumber
                style={{ width: '100%' }}
                value={carDetails.year}
                onChange={(value) => setCarDetails({
                  ...carDetails,
                  year: value
                })}
                min={1990}
                max={new Date().getFullYear()}
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item label="Mileage">
              <InputNumber
                style={{ width: '100%' }}
                value={carDetails.mileage}
                onChange={(value) => setCarDetails({
                  ...carDetails,
                  mileage: value
                })}
                min={0}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0}
                addonAfter="miles"
              />
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item label={rentalType === 'short-term' ? 'Duration (Days)' : 'Duration (Months)'}>
          <InputNumber
            style={{ width: '100%' }}
            value={duration}
            onChange={(value) => setDuration(Number(value))}
            min={1}
            addonAfter={rentalType === 'short-term' ? 'days' : 'months'}
          />
        </Form.Item>
        
        <Form.Item label="Route Type">
          <Select
            value={route}
            onChange={(value) => setRoute(value)}
            style={{ width: '100%' }}
          >
            <Option value="local">Local</Option>
            <Option value="regional">Regional</Option>
            <Option value="interstate">Interstate</Option>
          </Select>
        </Form.Item>
        
        <Form.Item label="Customer Type">
          <Select
            value={customerType}
            onChange={(value) => setCustomerType(value)}
            style={{ width: '100%' }}
          >
            <Option value="regular">Regular</Option>
            <Option value="premium">Premium</Option>
            <Option value="business">Business</Option>
          </Select>
        </Form.Item>
        
        <Form.Item label="Number of Cars">
          <InputNumber
            style={{ width: '100%' }}
            value={carQuantity}
            onChange={(value) => setCarQuantity(Math.max(1, Number(value)))}
            min={1}
            addonBefore={<CarOutlined />}
          />
        </Form.Item>
      </Form>
    </>
  );
};

export default RentalOptions;
