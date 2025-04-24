
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AirQualityCard from "@/components/AirQualityCard";
import WaterQualityCard from "@/components/WaterQualityCard";
import SensorMap from "@/components/SensorMap";
import AlertsPanel from "@/components/AlertsPanel";
import RecommendationsPanel from "@/components/RecommendationsPanel";
import { userRoles } from "@/services/sensorDataService";
import { useState } from "react";
import RoleSelector from "@/components/RoleSelector";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Droplets, Wind } from "lucide-react";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState("public");
  
  // Check if role allows access to certain features
  const canView = (feature: string) => {
    return userRoles[selectedRole as keyof typeof userRoles].canView.includes(feature);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-env-air to-env-water bg-clip-text text-transparent">
            Environmental Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring of air and water quality indicators
          </p>
        </div>
        <RoleSelector selectedRole={selectedRole} onRoleChange={setSelectedRole} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-background to-secondary/30">
            <CardContent className="p-0">
              <Tabs defaultValue="air-quality" className="w-full">
                <div className="border-b bg-muted/50 px-6 pt-4">
                  <TabsList className="w-full max-w-md h-12 rounded-t-xl rounded-b-none bg-transparent border-b border-transparent gap-2">
                    <TabsTrigger 
                      value="air-quality" 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-env-air rounded-none h-12 flex gap-2"
                    >
                      <Wind className="h-4 w-4" />
                      <span>Air Quality</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="water-quality" 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-env-water rounded-none h-12 flex gap-2"
                    >
                      <Droplets className="h-4 w-4" />
                      <span>Water Quality</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="sensor-map" 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12"
                    >
                      Sensor Map
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="air-quality" className="p-6 animate-in fade-in-50">
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
                
                <TabsContent value="water-quality" className="p-6 animate-in fade-in-50">
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
                
                <TabsContent value="sensor-map" className="p-6 animate-in fade-in-50">
                  <SensorMap />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-env-harmful" />
              <h2 className="text-2xl font-bold">Alerts & Notifications</h2>
            </div>
            <AlertsPanel />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          {canView("recommendations") && (
            <div className="sticky top-20">
              <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
              <RecommendationsPanel userRole={selectedRole} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
