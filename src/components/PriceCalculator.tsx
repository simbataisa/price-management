import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Input, 
  Select, 
  Form, 
  InputNumber, 
  Space, 
  Spin, 
  Divider, 
  Alert, 
  Row, 
  Col 
} from 'antd';
import { 
  CarOutlined, 
  CalculatorOutlined, 
  UserOutlined, 
  EnvironmentOutlined 
} from '@ant-design/icons';
import { Product, PriceRule, PriceCalculationResult } from '../types/pricing';
import { calculatePrice, priceRulesApi } from '../services/api';
import { evaluateConditionGroup } from '../utils/conditionEvaluator';

// Import sub-components
import RentalOptions from './pricing/RentalOptions';
import AddOns from './pricing/AddOns';
import ConfigurableServices from './pricing/ConfigurableServices';
import PricingRules from './pricing/PricingRules';
import CalculationResult from './pricing/CalculationResult';

// Import data
import { serviceOptions as defaultServiceOptions } from '../data/serviceOptions';
import { availableAddOns, carModels } from '../data/rentalData';
import { useLoading } from '../contexts/LoadingContext';

const { Title, Text } = Typography;
const { Option } = Select;

const PriceCalculator: React.FC = () => {
  // Add state for available rules from API
  const [availableRules, setAvailableRules] = useState<PriceRule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showLoading, hideLoading } = useLoading();
  
  // Car rental specific states
  const [rentalType, setRentalType] = useState<'short-term' | 'long-term'>('short-term');
  const [carDetails, setCarDetails] = useState({
    model: 'sedan',
    year: 2020,
    mileage: 30000,
  });
  
  // Fetch rules from API
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await priceRulesApi.getAll();
        setAvailableRules(response.data);
      } catch (error) {
        console.error('Failed to fetch pricing rules:', error);
        setError('Failed to fetch pricing rules. Please try again.');
      }
    };
    
    fetchRules();
  }, []);
  
  const [duration, setDuration] = useState(1);
  const [route, setRoute] = useState('local');
  const [addOns, setAddOns] = useState<string[]>([]);
  
  // New features
  const [pickupLocation, setPickupLocation] = useState('office');
  const [returnLocation, setReturnLocation] = useState('office');
  const [weddingDecoration, setWeddingDecoration] = useState(false);
  const [withDriver, setWithDriver] = useState(false);
  const [carQuantity, setCarQuantity] = useState(1);

  // Service options state
  const [serviceOptions] = useState(defaultServiceOptions);
  const [serviceValues, setServiceValues] = useState<Record<string, number>>({
    customPickup: 25,
    differentReturn: 35,
    weddingDecoration: 120,
    withDriver: 30,
    phoneAsKey: 15
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Original states
  const [product, setProduct] = useState<Partial<Product>>({
    id: 'car1',
    name: 'Car Rental',
    basePrice: 50, // Base price per day/month
    priceRules: [],
  });
  const [customerType, setCustomerType] = useState<string>('regular');
  const [calculation, setCalculation] = useState<PriceCalculationResult | null>(null);
  
  const [selectedRules, setSelectedRules] = useState<string[]>([]);

  const handleRuleToggle = (ruleId: string) => {
    if (selectedRules.includes(ruleId)) {
      setSelectedRules(selectedRules.filter(id => id !== ruleId));
    } else {
      setSelectedRules([...selectedRules, ruleId]);
    }
  };

  const handleAddOnToggle = (addOnId: string) => {
    if (addOns.includes(addOnId)) {
      setAddOns(addOns.filter(id => id !== addOnId));
    } else {
      setAddOns([...addOns, addOnId]);
    }
  };

  // Service handlers
  const handleServiceToggle = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const handleServiceValueChange = (serviceId: string, value: number) => {
    setServiceValues({
      ...serviceValues,
      [serviceId]: value
    });
  };

  const calculateFinalPrice = () => {
    setLoading(true);
    showLoading();
    setError(null);
    
    try {
      // Calculate car age
      const currentYear = new Date().getFullYear();
      const carAge = currentYear - carDetails.year;
      
      // Create context for condition evaluation
      const context = {
        customerType,
        date: new Date(),
        carAge,
        mileage: carDetails.mileage,
        route,
        duration,
        rentalType,
        pickupLocation,
        returnLocation,
        weddingDecoration,
        withDriver,
        carQuantity,
        carModel: carDetails.model.toLowerCase(),
        addOns,
        selectedServices,
        isWeekend: new Date().getDay() === 0 || new Date().getDay() === 6,
        isSummer: new Date().getMonth() >= 5 && new Date().getMonth() <= 7, // June, July, August
        differentReturn: pickupLocation !== returnLocation
      };
      
      // Filter rules based on sophisticated condition logic
      const applicableRules = availableRules.filter(rule => {
        // Check legacy conditions for backward compatibility
        if (rule.conditions) {
          // Legacy condition checks
          return true;
        }
        
        // Check new condition logic
        if (rule.conditionLogic) {
          return evaluateConditionGroup(rule.conditionLogic, context);
        }
        
        return true;
      });
      
      // Get selected rules that are also applicable
      const selectedRulesData = applicableRules.filter(rule => 
        selectedRules.includes(rule.id)
      );
      
      // Apply selected services as rules
      const serviceRules: PriceRule[] = selectedServices.map(serviceId => {
        const service = serviceOptions.find(s => s.id === serviceId);
        if (!service) return null;
        
        return {
          id: `service-${serviceId}`,
          name: service.name,
          description: service.description,
          type: service.type === 'percentage' ? 'percentage' : 'fixed',
          value: -serviceValues[serviceId], // Negative value means increase
          active: true,
          priority: 1,
          level: 'service',
          stackable: true,
          conditions: {
            serviceType: serviceId
          }
        };
      }).filter(Boolean) as PriceRule[];

      // Combine with other selected rules
      const allSelectedRules = [...selectedRulesData, ...serviceRules];
      
      // Find the base price for the selected car model
      const selectedModel = carModels.find(model => 
        model.id === carDetails.model.toLowerCase()
      );
      const basePrice = selectedModel ? selectedModel.basePrice : 50;
      
      // Calculate add-on costs
      const addOnTotal = addOns.reduce((total, addOnId) => {
        const addOn = availableAddOns.find(a => a.id === addOnId);
        return total + (addOn ? addOn.price : 0);
      }, 0);
      
      // Create product with updated base price and rules
      const productWithRules: Product = {
        ...product as Product,
        basePrice: basePrice + addOnTotal,
        priceRules: allSelectedRules
      };
      
      const result = calculatePrice(productWithRules, duration, context);
      
      // Multiply by car quantity for the final price
      const finalPrice = result.finalPrice * carQuantity;
      const originalPrice = productWithRules.basePrice * duration * carQuantity;
      
      // Convert to PriceCalculationResult format
      const calculationResult: PriceCalculationResult = {
        originalPrice: originalPrice,
        finalPrice: finalPrice,
        appliedRules: result.appliedRules,
        breakdown: result.breakdown,
        savings: originalPrice - finalPrice,
        savingsPercentage: (originalPrice - finalPrice) / originalPrice * 100
      };
      
      setCalculation(calculationResult);
    } catch (err) {
      setError('Failed to calculate price. Please try again.');
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  return (
    <Card>
      <Title level={4}>Price Calculator</Title>
      <Divider />
      
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="Rental Options" type="inner">
          <RentalOptions
            rentalType={rentalType}
            setRentalType={setRentalType}
            carDetails={carDetails}
            setCarDetails={setCarDetails}
            duration={duration}
            setDuration={setDuration}
            route={route}
            setRoute={setRoute}
            customerType={customerType}
            setCustomerType={setCustomerType}
            carQuantity={carQuantity}
            setCarQuantity={setCarQuantity}
            carModels={carModels}
          />
          
          <AddOns
            addOns={addOns}
            handleAddOnToggle={handleAddOnToggle}
            availableAddOns={availableAddOns}
            rentalType={rentalType}
            pickupLocation={pickupLocation}
            setPickupLocation={setPickupLocation}
            returnLocation={returnLocation}
            setReturnLocation={setReturnLocation}
            withDriver={withDriver}
            setWithDriver={setWithDriver}
            weddingDecoration={weddingDecoration}
            setWeddingDecoration={setWeddingDecoration}
          />
          
          <ConfigurableServices
            serviceOptions={serviceOptions}
            selectedServices={selectedServices}
            serviceValues={serviceValues}
            handleServiceToggle={handleServiceToggle}
            handleServiceValueChange={handleServiceValueChange}
          />
          
          <div style={{ marginTop: 16 }}>
            <Button
              type="primary"
              icon={<CalculatorOutlined />}
              onClick={calculateFinalPrice}
              loading={loading}
              size="large"
            >
              Calculate Price
            </Button>
          </div>
        </Card>
        
        <Card title="Pricing Rules" type="inner">
          <PricingRules
            availableRules={availableRules}
            selectedRules={selectedRules}
            handleRuleToggle={handleRuleToggle}
          />
        </Card>
        
        {calculation && (
          <Card title="Calculation Result" type="inner">
            <CalculationResult calculation={calculation} />
          </Card>
        )}
      </Space>
    </Card>
  );
};

export default PriceCalculator;