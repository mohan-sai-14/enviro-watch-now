
// Default thresholds for pollutants
export const thresholds = {
  air: {
    pm25: { good: 12, moderate: 35.4, poor: 55.4, harmful: 150.4 },
    co2: { good: 700, moderate: 1000, poor: 2000, harmful: 5000 },
    no2: { good: 53, moderate: 100, poor: 360, harmful: 649 },
  },
  water: {
    turbidity: { good: 1, moderate: 5, poor: 10, harmful: 20 },
    ph: { good: [6.5, 8.5], moderate: [6, 9], poor: [5, 10], harmful: [0, 14] },
    lead: { good: 5, moderate: 10, poor: 15, harmful: 50 },
  }
};

// User roles and permissions
export const userRoles = {
  public: {
    name: "Public",
    canView: ["summary", "map", "alerts"],
    canAccess: ["current"],
  },
  authority: {
    name: "Authority",
    canView: ["summary", "map", "alerts", "detailed", "recommendations"],
    canAccess: ["current", "historical", "forecast"],
  },
  researcher: {
    name: "Researcher",
    canView: ["summary", "map", "alerts", "detailed", "raw"],
    canAccess: ["current", "historical", "forecast", "api"],
  }
};

// Sensor locations
export const sensorLocations = [
  { id: "sensor1", name: "Downtown", lat: 40.7128, lng: -74.0060, type: "urban" },
  { id: "sensor2", name: "Industrial Zone", lat: 40.7282, lng: -73.9942, type: "industrial" },
  { id: "sensor3", name: "Riverside", lat: 40.7031, lng: -74.0160, type: "water" },
  { id: "sensor4", name: "Residential Area", lat: 40.7589, lng: -73.9850, type: "residential" },
  { id: "sensor5", name: "Park", lat: 40.7812, lng: -73.9665, type: "park" },
];

// Random data generation within appropriate ranges
function getRandomValue(min: number, max: number, decimals = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

// Generate a somewhat realistic fluctuating value that changes within bounds
function fluctuate(baseValue: number, maxChange: number, min: number, max: number): number {
  const change = (Math.random() - 0.5) * 2 * maxChange;
  return Math.max(min, Math.min(max, baseValue + change));
}

// Data storage for historical values to ensure realistic changes
const baseValues = {
  pm25: getRandomValue(5, 200),
  co2: getRandomValue(400, 5000),
  no2: getRandomValue(10, 500),
  turbidity: getRandomValue(0.5, 25),
  ph: getRandomValue(4, 10, 1),
  lead: getRandomValue(1, 60),
};

// Get status based on value and thresholds
export function getStatus(value: number, threshold: any): string {
  // Special case for pH which has a range
  if (Array.isArray(threshold.good)) {
    if (value >= threshold.good[0] && value <= threshold.good[1]) return "good";
    if (value >= threshold.moderate[0] && value <= threshold.moderate[1]) return "moderate";
    if (value >= threshold.poor[0] && value <= threshold.poor[1]) return "poor";
    return "harmful";
  }
  
  // Normal threshold comparison
  if (value <= threshold.good) return "good";
  if (value <= threshold.moderate) return "moderate";
  if (value <= threshold.poor) return "poor";
  return "harmful";
}

// Get all current sensor data
export function getCurrentSensorData() {
  // Update base values with small fluctuations
  baseValues.pm25 = fluctuate(baseValues.pm25, 10, 1, 400);
  baseValues.co2 = fluctuate(baseValues.co2, 100, 350, 10000);
  baseValues.no2 = fluctuate(baseValues.no2, 20, 1, 1000);
  baseValues.turbidity = fluctuate(baseValues.turbidity, 1, 0.1, 50);
  baseValues.ph = fluctuate(baseValues.ph, 0.2, 2, 12);
  baseValues.lead = fluctuate(baseValues.lead, 3, 0, 100);

  // Calculate status values
  const pm25Status = getStatus(baseValues.pm25, thresholds.air.pm25);
  const co2Status = getStatus(baseValues.co2, thresholds.air.co2);
  const no2Status = getStatus(baseValues.no2, thresholds.air.no2);
  const turbidityStatus = getStatus(baseValues.turbidity, thresholds.water.turbidity);
  const phStatus = getStatus(baseValues.ph, thresholds.water.ph);
  const leadStatus = getStatus(baseValues.lead, thresholds.water.lead);
  
  // Calculate overall status
  const airStatuses = [pm25Status, co2Status, no2Status];
  const waterStatuses = [turbidityStatus, phStatus, leadStatus];
  
  // Helper function to get worst status
  const getWorstStatus = (statuses: string[]) => {
    if (statuses.includes("harmful")) return "harmful";
    if (statuses.includes("poor")) return "poor";
    if (statuses.includes("moderate")) return "moderate";
    return "good";
  };
  
  return {
    timestamp: new Date().toISOString(),
    air: {
      pm25: {
        value: baseValues.pm25.toFixed(1),
        unit: "μg/m³",
        status: pm25Status
      },
      co2: {
        value: baseValues.co2.toFixed(0),
        unit: "ppm",
        status: co2Status
      },
      no2: {
        value: baseValues.no2.toFixed(1),
        unit: "ppb",
        status: no2Status
      },
      overall: getWorstStatus(airStatuses)
    },
    water: {
      turbidity: {
        value: baseValues.turbidity.toFixed(1),
        unit: "NTU",
        status: turbidityStatus
      },
      ph: {
        value: baseValues.ph.toFixed(1),
        unit: "pH",
        status: phStatus
      },
      lead: {
        value: baseValues.lead.toFixed(1),
        unit: "ppb",
        status: leadStatus
      },
      overall: getWorstStatus(waterStatuses)
    },
    alerts: []
  };
}

// Generate data for each sensor
export function getSensorMapData() {
  return sensorLocations.map(sensor => {
    // Slightly different data for each sensor
    const sensorMultiplier = 
      sensor.type === "industrial" ? 1.5 : 
      sensor.type === "urban" ? 1.3 : 
      sensor.type === "residential" ? 0.8 : 
      sensor.type === "water" ? 0.9 : 0.7;
    
    const isWaterSensor = sensor.type === "water" || sensor.type === "riverside";
    
    // Air data for all sensors
    const airData = {
      pm25: {
        value: (baseValues.pm25 * sensorMultiplier).toFixed(1),
        unit: "μg/m³",
        status: ""
      },
      co2: {
        value: (baseValues.co2 * sensorMultiplier).toFixed(0),
        unit: "ppm",
        status: ""
      },
      no2: {
        value: (baseValues.no2 * sensorMultiplier).toFixed(1),
        unit: "ppb",
        status: ""
      }
    };
    
    // Calculate air statuses
    airData.pm25.status = getStatus(parseFloat(airData.pm25.value), thresholds.air.pm25);
    airData.co2.status = getStatus(parseFloat(airData.co2.value), thresholds.air.co2);
    airData.no2.status = getStatus(parseFloat(airData.no2.value), thresholds.air.no2);
    
    // Overall air status
    const airStatuses = [airData.pm25.status, airData.co2.status, airData.no2.status];
    const airOverall = 
      airStatuses.includes("harmful") ? "harmful" :
      airStatuses.includes("poor") ? "poor" :
      airStatuses.includes("moderate") ? "moderate" : "good";
    
    // Water data only for water-related sensors
    let waterData = null;
    let waterOverall = null;
    
    if (isWaterSensor) {
      waterData = {
        turbidity: {
          value: (baseValues.turbidity * sensorMultiplier).toFixed(1),
          unit: "NTU",
          status: ""
        },
        ph: {
          value: (baseValues.ph * (sensorMultiplier > 1 ? 0.9 : 1.1)).toFixed(1),
          unit: "pH",
          status: ""
        },
        lead: {
          value: (baseValues.lead * sensorMultiplier).toFixed(1),
          unit: "ppb",
          status: ""
        }
      };
      
      // Calculate water statuses
      waterData.turbidity.status = getStatus(parseFloat(waterData.turbidity.value), thresholds.water.turbidity);
      waterData.ph.status = getStatus(parseFloat(waterData.ph.value), thresholds.water.ph);
      waterData.lead.status = getStatus(parseFloat(waterData.lead.value), thresholds.water.lead);
      
      // Overall water status
      const waterStatuses = [waterData.turbidity.status, waterData.ph.status, waterData.lead.status];
      waterOverall = 
        waterStatuses.includes("harmful") ? "harmful" :
        waterStatuses.includes("poor") ? "poor" :
        waterStatuses.includes("moderate") ? "moderate" : "good";
    }
    
    return {
      ...sensor,
      data: {
        air: {
          ...airData,
          overall: airOverall
        },
        water: waterData ? {
          ...waterData,
          overall: waterOverall
        } : null
      }
    };
  });
}

// Generate alerts based on current data
export function generateAlerts(data: any) {
  const alerts = [];
  
  // Check air quality
  if (data.air.pm25.status === "harmful") {
    alerts.push({
      id: `pm25-${Date.now()}`,
      type: "air",
      severity: "high",
      title: "Dangerous PM2.5 Levels",
      message: "PM2.5 particulate matter has reached harmful levels. Limit outdoor activities and wear N95 masks if going outside.",
      timestamp: new Date().toISOString()
    });
  } else if (data.air.pm25.status === "poor") {
    alerts.push({
      id: `pm25-${Date.now()}`,
      type: "air",
      severity: "medium",
      title: "Elevated PM2.5 Levels",
      message: "PM2.5 levels are elevated. Sensitive groups should reduce outdoor activities.",
      timestamp: new Date().toISOString()
    });
  }
  
  if (data.air.co2.status === "harmful") {
    alerts.push({
      id: `co2-${Date.now()}`,
      type: "air",
      severity: "high",
      title: "Dangerous CO2 Levels",
      message: "CO2 has reached harmful levels. Improve ventilation immediately and consider evacuation if indoors.",
      timestamp: new Date().toISOString()
    });
  }
  
  if (data.air.no2.status === "harmful" || data.air.no2.status === "poor") {
    alerts.push({
      id: `no2-${Date.now()}`,
      type: "air",
      severity: data.air.no2.status === "harmful" ? "high" : "medium",
      title: "Elevated NO2 Levels",
      message: "NO2 levels are elevated. Reduce exposure by staying indoors and keeping windows closed.",
      timestamp: new Date().toISOString()
    });
  }
  
  // Check water quality
  if (data.water.lead.status === "harmful") {
    alerts.push({
      id: `lead-${Date.now()}`,
      type: "water",
      severity: "high",
      title: "Dangerous Lead Levels",
      message: "Lead levels in water have reached harmful levels. Do not consume tap water and seek alternative sources.",
      timestamp: new Date().toISOString()
    });
  } else if (data.water.lead.status === "poor") {
    alerts.push({
      id: `lead-${Date.now()}`,
      type: "water",
      severity: "medium",
      title: "Elevated Lead Levels",
      message: "Lead levels in water are elevated. Consider using water filters or bottled water.",
      timestamp: new Date().toISOString()
    });
  }
  
  if (data.water.ph.status === "harmful" || data.water.ph.status === "poor") {
    alerts.push({
      id: `ph-${Date.now()}`,
      type: "water",
      severity: data.water.ph.status === "harmful" ? "high" : "medium",
      title: "Abnormal pH Levels",
      message: `Water pH is ${parseFloat(data.water.ph.value) > 8.5 ? "too alkaline" : "too acidic"}. Not recommended for consumption without treatment.`,
      timestamp: new Date().toISOString()
    });
  }
  
  if (data.water.turbidity.status === "harmful") {
    alerts.push({
      id: `turbidity-${Date.now()}`,
      type: "water",
      severity: "high",
      title: "High Water Turbidity",
      message: "Water turbidity is very high. Water may contain harmful contaminants and should not be consumed without treatment.",
      timestamp: new Date().toISOString()
    });
  }
  
  return alerts;
}

// Generate recommendations based on data and user role
export function getRecommendations(data: any, role: string) {
  const recommendations = [];
  
  // Public recommendations
  if (role === "public") {
    if (data.air.overall === "harmful" || data.air.overall === "poor") {
      recommendations.push({
        id: "air-public-1",
        title: "Limit Outdoor Exposure",
        description: "Stay indoors when possible, keep windows closed, and use air purifiers if available."
      });
    }
    
    if (data.water.overall === "harmful" || data.water.overall === "poor") {
      recommendations.push({
        id: "water-public-1",
        title: "Water Consumption Safety",
        description: "Use filtered or bottled water for drinking and cooking until water quality improves."
      });
    }
  }
  
  // Authority recommendations
  if (role === "authority") {
    if (data.air.overall === "harmful") {
      recommendations.push({
        id: "air-authority-1",
        title: "Issue Public Health Advisory",
        description: "Alert residents about harmful air quality conditions and provide guidance for vulnerable populations."
      });
    }
    
    if (data.water.lead.status === "harmful" || data.water.lead.status === "poor") {
      recommendations.push({
        id: "water-authority-1",
        title: "Immediate Water Testing",
        description: "Conduct comprehensive water testing at affected areas and consider distributing water filters to residents."
      });
    }
  }
  
  // Researcher recommendations
  if (role === "researcher") {
    if (data.air.pm25.status === "harmful" || data.air.pm25.status === "poor") {
      recommendations.push({
        id: "air-researcher-1",
        title: "PM2.5 Source Analysis",
        description: "Analyze potential sources of particulate matter in affected areas. Compare with historical data to identify patterns."
      });
    }
    
    if (data.water.turbidity.status === "harmful" || data.water.turbidity.status === "poor") {
      recommendations.push({
        id: "water-researcher-1",
        title: "Turbidity Correlation Study",
        description: "Investigate correlation between increased turbidity and recent precipitation or industrial activities."
      });
    }
  }
  
  return recommendations;
}
