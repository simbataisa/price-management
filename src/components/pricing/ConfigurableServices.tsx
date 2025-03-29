import React from 'react';
import {
  Typography,
  Card,
  Checkbox,
  Tag,
  Space,
  Slider,
  Divider
} from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { ServiceOption } from '../../types/pricing';

interface ConfigurableServicesProps {
  serviceOptions: ServiceOption[];
  selectedServices: string[];
  serviceValues: Record<string, number>;
  handleServiceToggle: (serviceId: string) => void;
  handleServiceValueChange: (serviceId: string, value: number) => void;
}

const { Title, Text } = Typography;

const ConfigurableServices: React.FC<ConfigurableServicesProps> = ({
  serviceOptions,
  selectedServices,
  serviceValues,
  handleServiceToggle,
  handleServiceValueChange
}) => {
  return (
    <>
      <Title level={5} style={{ marginTop: 24, marginBottom: 8 }}>
        <SettingOutlined /> Configurable Services
      </Title>
      
      <Space direction="vertical" style={{ width: '100%' }}>
        {serviceOptions.map(service => (
          <Card 
            key={service.id} 
            style={{ 
              borderColor: selectedServices.includes(service.id) ? '#1890ff' : '#f0f0f0',
              marginBottom: 8
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Checkbox 
                  checked={selectedServices.includes(service.id)}
                  onChange={() => handleServiceToggle(service.id)}
                >
                  <Text strong>{service.name}</Text>
                </Checkbox>
                <div style={{ marginLeft: 24 }}>
                  <Text type="secondary">{service.description}</Text>
                </div>
              </div>
              <Tag 
                color={selectedServices.includes(service.id) ? "blue" : "default"}
              >
                {service.type === 'fixed' 
                  ? `$${serviceValues[service.id]}` 
                  : `${serviceValues[service.id]}%`
                }
              </Tag>
            </div>
            
            {service.configurable && selectedServices.includes(service.id) && (
              <div style={{ marginTop: 16, paddingLeft: 24 }}>
                <Divider style={{ margin: '8px 0' }} />
                <Text>
                  Adjust {service.type === 'fixed' ? 'fee' : 'rate'}:
                </Text>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                  <Text type="secondary" style={{ marginRight: 12 }}>{service.minValue}</Text>
                  <Slider
                    min={service.minValue}
                    max={service.maxValue}
                    step={service.valueStep}
                    value={serviceValues[service.id]}
                    onChange={(value) => handleServiceValueChange(service.id, value)}
                    style={{ flex: 1 }}
                  />
                  <Text type="secondary" style={{ marginLeft: 12 }}>{service.maxValue}</Text>
                </div>
              </div>
            )}
          </Card>
        ))}
      </Space>
    </>
  );
};

export default ConfigurableServices;