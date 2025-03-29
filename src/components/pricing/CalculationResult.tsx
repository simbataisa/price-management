import React from 'react';
import {
  Typography,
  Divider,
  Card,
  Tag,
  Space,
  Row,
  Col
} from 'antd';
import { CheckCircleOutlined, WarningOutlined, ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { PriceCalculationResult } from '../../types/pricing';

interface CalculationResultProps {
  calculation: PriceCalculationResult | null;
}

const { Title, Text } = Typography;

const CalculationResult: React.FC<CalculationResultProps> = ({ calculation }) => {
  if (!calculation) return null;

  return (
    <Card>
      <Title level={5}>
        Price Calculation Result
      </Title>
      
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={5} style={{ margin: 0 }}>
            Base Price: ${calculation.originalPrice.toFixed(2)}
          </Title>
        </Col>
        <Col>
          <Title level={5} style={{ margin: 0, color: '#1890ff' }}>
            Final Price: ${calculation.finalPrice.toFixed(2)}
          </Title>
        </Col>
      </Row>
      
      {calculation.savings > 0 ? (
        <Text type="success" style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>
          <ArrowDownOutlined /> You Save: ${calculation.savings.toFixed(2)} ({calculation.savingsPercentage.toFixed(1)}%)
        </Text>
      ) : (
        <Text type="danger" style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>
          <ArrowUpOutlined /> Additional Charges: ${Math.abs(calculation.savings).toFixed(2)} ({Math.abs(calculation.savingsPercentage).toFixed(1)}%)
        </Text>
      )}
      
      <Divider />
      
      <Title level={5} style={{ marginBottom: 16 }}>
        Applied Rules:
      </Title>
      
      {calculation.breakdown.length === 0 ? (
        <Text>No rules were applied</Text>
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          {calculation.breakdown.map((item, index) => (
            <Card 
              key={index} 
              style={{ marginBottom: 8 }}
              size="small"
            >
              <Row justify="space-between" align="top">
                <Col>
                  <Text strong>{item.rule.name}</Text>
                </Col>
                <Col>
                  <Text 
                    type={item.discount > 0 ? "success" : "danger"}
                    strong
                  >
                    {item.discount > 0 ? "-" : "+"}${Math.abs(item.discount).toFixed(2)}
                  </Text>
                </Col>
              </Row>
              <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                {item.rule.description}
              </Text>
              <div style={{ marginTop: 8 }}>
                <Space>
                  <Tag color="blue">Level: {item.rule.level}</Tag>
                  <Tag color="purple">Priority: {item.rule.priority}</Tag>
                </Space>
              </div>
            </Card>
          ))}
        </Space>
      )}
    </Card>
  );
};

export default CalculationResult;