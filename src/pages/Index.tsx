import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AirQualityCard from "@/components/AirQualityCard";
import WaterQualityCard from "@/components/WaterQualityCard";
import SensorMap from "@/components/SensorMap";
import AlertsPanel from "@/components/AlertsPanel";
import RecommendationsPanel from "@/components/RecommendationsPanel";
import { userRoles } from "@/services/sensorDataService";
import { useState } from "react";

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
      </div>
    </div>
  );
};

export default Index;
