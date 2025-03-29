import React from 'react';
import {
  Typography,
  Checkbox,
  Select,
  Form,
  Space,
  Row,
  Col,
} from 'antd';
import { CarOutlined, HomeOutlined, GiftOutlined, UserOutlined } from '@ant-design/icons';

interface AddOn {
  id: string;
  name: string;
  price: number;
}

interface AddOnsProps {
  addOns: string[];
  handleAddOnToggle: (addOnId: string) => void;
  availableAddOns: AddOn[];
  rentalType: 'short-term' | 'long-term';
  pickupLocation: string;
  setPickupLocation: (location: string) => void;
  returnLocation: string;
  setReturnLocation: (location: string) => void;
  withDriver: boolean;
  setWithDriver: (withDriver: boolean) => void;
  weddingDecoration: boolean;
  setWeddingDecoration: (weddingDecoration: boolean) => void;
}

const { Title } = Typography;
const { Option } = Select;

const AddOns: React.FC<AddOnsProps> = ({
  addOns,
  handleAddOnToggle,
  availableAddOns,
  rentalType,
  pickupLocation,
  setPickupLocation,
  returnLocation,
  setReturnLocation,
  withDriver,
  setWithDriver,
  weddingDecoration,
  setWeddingDecoration
}) => {
  return (
    <>
      <Title level={5} style={{ marginTop: 16, marginBottom: 8 }}>
        <GiftOutlined /> Add-on Services
      </Title>
      
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={[16, 8]}>
          {availableAddOns.map(addOn => (
            <Col key={addOn.id} xs={24} sm={12} md={8}>
              <Checkbox 
                checked={addOns.includes(addOn.id)}
                onChange={() => handleAddOnToggle(addOn.id)}
              >
                {addOn.name} (+${addOn.price}/{rentalType === 'short-term' ? 'day' : 'month'})
              </Checkbox>
            </Col>
          ))}
        </Row>
        
        <Form layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Pickup Location">
                <Select
                  value={pickupLocation}
                  onChange={(value) => setPickupLocation(value)}
                  style={{ width: '100%' }}
                >
                  <Option value="office">Rental Office</Option>
                  <Option value="airport">Airport</Option>
                  <Option value="hotel">Hotel</Option>
                  <Option value="custom">Custom Address (+$25)</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item label="Return Location">
                <Select
                  value={returnLocation}
                  onChange={(value) => setReturnLocation(value)}
                  style={{ width: '100%' }}
                >
                  <Option value="office">Rental Office</Option>
                  <Option value="airport">Airport</Option>
                  <Option value="hotel">Hotel</Option>
                  <Option value="custom">Custom Address</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item>
                <Checkbox 
                  checked={withDriver}
                  onChange={(e) => setWithDriver(e.target.checked)}
                >
                  <Space>
                    <UserOutlined />
                    <span>Include Professional Driver (+30%)</span>
                  </Space>
                </Checkbox>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item>
                <Checkbox 
                  checked={weddingDecoration}
                  onChange={(e) => setWeddingDecoration(e.target.checked)}
                >
                  <Space>
                    <GiftOutlined />
                    <span>Wedding Decoration (+$120)</span>
                  </Space>
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Space>
    </>
  );
};

export default AddOns;