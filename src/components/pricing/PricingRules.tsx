import React, { useState, useEffect } from 'react';
import {
  Typography,
  List,
  Card,
  Tag,
  Tooltip,
  Button,
  Space,
  Empty
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { PriceRule, ConditionGroup } from '../../types/pricing';
import { priceRulesApi } from '../../services/api'; // Import the API service

interface PricingRulesProps {
  availableRules: PriceRule[];
  selectedRules: string[];
  handleRuleToggle: (ruleId: string) => void;
}

const { Title, Text, Paragraph } = Typography;

// Update the component to accept props
const PricingRules: React.FC<PricingRulesProps> = ({ 
  availableRules: propRules, 
  selectedRules = [], 
  handleRuleToggle 
}) => {
  const [availableRules, setAvailableRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        // Use the API service instead of direct fetch
        const { data } = await priceRulesApi.getAll();
        
        // Make sure we're setting an array to state
        setAvailableRules(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load pricing rules');
        setLoading(false);
      }
    };

    // If props are provided, use them instead of fetching
    if (propRules && propRules.length > 0) {
      setAvailableRules(propRules);
      setLoading(false);
    } else {
      fetchRules();
    }
  }, [propRules]);

  // Helper function to render condition logic in a readable format
  const renderConditionLogic = (group: ConditionGroup): React.ReactElement => {
    return (
      <div style={{ marginLeft: 16 }}>
        <Text strong>
          {group.logic}
        </Text>
        <div style={{ marginLeft: 16 }}>
          {group.conditions.map((cond, idx) => {
            if ('logic' in cond) {
              return (
                <div key={idx} style={{ marginTop: 8 }}>
                  {renderConditionLogic(cond as ConditionGroup)}
                </div>
              );
            } else {
              const condition = cond as any;
              return (
                <Text key={idx}>
                  {condition.type} {condition.operator || '='} {String(condition.value)}
                </Text>
              );
            }
          })}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <Title level={5}>
        Applicable Pricing Rules
      </Title>
      {availableRules.length === 0 ? (
        <Empty description="No pricing rules available. Add rules in the Pricing Rules tab." />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={Array.isArray(availableRules) ? availableRules.filter(rule => rule.active) : []}
          renderItem={(rule) => (
            <List.Item 
              key={rule.id}
              style={{ 
                marginBottom: 8,
                padding: 0
              }}
            >
              <Card 
                style={{ 
                  width: '100%',
                  cursor: 'pointer',
                  backgroundColor: selectedRules.includes(rule.id) ? '#f0f5ff' : 'white',
                  borderColor: selectedRules.includes(rule.id) ? '#1890ff' : '#f0f0f0'
                }}
                bodyStyle={{ padding: '12px 16px' }}
                onClick={() => handleRuleToggle(rule.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <Text strong>{rule.name}</Text>
                  <Tag color="blue">Priority: {rule.priority}</Tag>
                  <Tag color="purple">{rule.level}</Tag>
                  {rule.value < 0 && (
                    <Tag color="red">Surcharge</Tag>
                  )}
                  {rule.conditionLogic && (
                    <Tooltip title={
                      <div>
                        {renderConditionLogic(rule.conditionLogic)}
                      </div>
                    }>
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<InfoCircleOutlined />} 
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Tooltip>
                  )}
                </div>
                {rule.description && (
                  <Paragraph type="secondary" style={{ marginBottom: 0, marginTop: 4 }}>
                    {rule.description}
                  </Paragraph>
                )}
              </Card>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default PricingRules;