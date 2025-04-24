
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AirQualityCard from "@/components/AirQualityCard";
import WaterQualityCard from "@/components/WaterQualityCard";
import SensorMap from "@/components/SensorMap";
import AlertsPanel from "@/components/AlertsPanel";
import UserRoleSelector from "@/components/UserRoleSelector";
import RecommendationsPanel from "@/components/RecommendationsPanel";
import { userRoles } from "@/services/sensorDataService";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState("public");
  
  // Check if role allows access to certain features
  const canView = (feature: string) => {
    return userRoles[selectedRole as keyof typeof userRoles].canView.includes(feature);
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-6">Environmental Dashboard</h2>
            <Tabs defaultValue="air-quality" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="air-quality">Air Quality</TabsTrigger>
                <TabsTrigger value="water-quality">Water Quality</TabsTrigger>
                <TabsTrigger value="sensor-map">Sensor Map</TabsTrigger>
              </TabsList>
              <TabsContent value="air-quality" className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <AirQualityCard
                    pollutant="pm25"
                    title="PM2.5"
                    description="Fine particulate matter suspended in air"
                  />
                  <AirQualityCard
                    pollutant="co2"
                    title="CO2"
                    description="Carbon dioxide concentration in air"
                  />
                  <AirQualityCard
                    pollutant="no2"
                    title="NO2"
                    description="Nitrogen dioxide pollution level"
                  />
                </div>
              </TabsContent>
              <TabsContent value="water-quality" className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <WaterQualityCard
                    pollutant="turbidity"
                    title="Turbidity"
                    description="Water cloudiness or haziness"
                  />
                  <WaterQualityCard
                    pollutant="ph"
                    title="pH Level"
                    description="Acidity or alkalinity of water (0-14)"
                  />
                  <WaterQualityCard
                    pollutant="lead"
                    title="Lead (Pb)"
                    description="Heavy metal concentration in water"
                  />
                </div>
              </TabsContent>
              <TabsContent value="sensor-map" className="pt-6">
                <SensorMap />
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Alerts & Notifications</h2>
            <AlertsPanel />
          </div>
          
          {canView("recommendations") && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-6">Recommendations</h2>
              <RecommendationsPanel userRole={selectedRole} />
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <UserRoleSelector
              selectedRole={selectedRole}
              onChange={setSelectedRole}
            />
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Information Disclosure</h3>
              <p className="text-sm text-muted-foreground mb-6">
                This dashboard shows simulated environmental data for 
                educational and demonstration purposes only.
              </p>
              
              <h3 className="font-medium mb-2">Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-env-good mr-2"></div>
                  <span className="text-sm">Good - Minimal or no risk</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-env-moderate mr-2"></div>
                  <span className="text-sm">Moderate - Moderate health concern</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-env-poor mr-2"></div>
                  <span className="text-sm">Poor - Unhealthy for sensitive groups</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-env-harmful mr-2"></div>
                  <span className="text-sm">Harmful - Health warnings, everyone may be affected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
