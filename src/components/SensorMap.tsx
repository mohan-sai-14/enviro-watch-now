
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSensorMapData } from "@/services/sensorDataService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const SensorMap = () => {
  const [sensorData, setSensorData] = useState<any[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<any>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Initial load
    const data = getSensorMapData();
    setSensorData(data);
    
    // Update every 5 seconds
    const interval = setInterval(() => {
      const newData = getSensorMapData();
      setSensorData(newData);
      
      // Check if any sensor status changed to harmful
      newData.forEach(sensor => {
        if (sensor.data.air.overall === "harmful" && 
            (!sensorData.find(s => s.id === sensor.id) || 
             sensorData.find(s => s.id === sensor.id).data.air.overall !== "harmful")) {
          toast({
            title: "Air Quality Alert",
            description: `Harmful air quality detected at ${sensor.name}`,
            variant: "destructive",
          });
        }
        
        if (sensor.data.water && sensor.data.water.overall === "harmful" && 
            (!sensorData.find(s => s.id === sensor.id) || 
             !sensorData.find(s => s.id === sensor.id).data.water ||
             sensorData.find(s => s.id === sensor.id).data.water.overall !== "harmful")) {
          toast({
            title: "Water Quality Alert",
            description: `Harmful water quality detected at ${sensor.name}`,
            variant: "destructive",
          });
        }
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [sensorData, toast]);
  
  // Helper function for status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "bg-env-good";
      case "moderate": return "bg-env-moderate";
      case "poor": return "bg-env-poor";
      case "harmful": return "bg-env-harmful";
      default: return "bg-gray-400";
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good": return "bg-env-good text-white";
      case "moderate": return "bg-env-moderate text-black";
      case "poor": return "bg-env-poor text-white";
      case "harmful": return "bg-env-harmful text-white animate-pulse-alert";
      default: return "bg-gray-400";
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Sensor Network Map</CardTitle>
        <CardDescription>
          Real-time pollution data from sensors across the city
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-[400px]">
          <div className="w-1/3 pr-4 border-r overflow-y-auto">
            <h3 className="font-medium mb-2">Sensor Locations</h3>
            
            <div className="space-y-2">
              {sensorData.map((sensor) => (
                <Button 
                  key={sensor.id}
                  variant={selectedSensor?.id === sensor.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedSensor(sensor)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{sensor.name}</span>
                    <div className="flex space-x-1">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(sensor.data.air.overall)}`}></div>
                      {sensor.data.water && (
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(sensor.data.water.overall)}`}></div>
                      )}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="w-2/3 pl-4">
            {selectedSensor ? (
              <div className="h-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">{selectedSensor.name}</h3>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="capitalize">
                      {selectedSensor.type}
                    </Badge>
                    <Badge className={getStatusBadge(selectedSensor.data.air.overall)}>
                      Air: {selectedSensor.data.air.overall}
                    </Badge>
                    {selectedSensor.data.water && (
                      <Badge className={getStatusBadge(selectedSensor.data.water.overall)}>
                        Water: {selectedSensor.data.water.overall}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Tabs defaultValue="air">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="air" className="flex items-center">
                      <span>Air Quality</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="water" 
                      disabled={!selectedSensor.data.water}
                      className="flex items-center"
                    >
                      <span>Water Quality</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="air" className="pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="border rounded p-3">
                          <div className="text-sm text-muted-foreground">PM2.5</div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="text-xl font-semibold">
                              {selectedSensor.data.air.pm25.value} {selectedSensor.data.air.pm25.unit}
                            </div>
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedSensor.data.air.pm25.status)}`}></div>
                          </div>
                        </div>
                        
                        <div className="border rounded p-3">
                          <div className="text-sm text-muted-foreground">CO2</div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="text-xl font-semibold">
                              {selectedSensor.data.air.co2.value} {selectedSensor.data.air.co2.unit}
                            </div>
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedSensor.data.air.co2.status)}`}></div>
                          </div>
                        </div>
                        
                        <div className="border rounded p-3">
                          <div className="text-sm text-muted-foreground">NO2</div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="text-xl font-semibold">
                              {selectedSensor.data.air.no2.value} {selectedSensor.data.air.no2.unit}
                            </div>
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedSensor.data.air.no2.status)}`}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted p-4 rounded">
                        <h4 className="font-medium mb-1">Interpretation</h4>
                        <p className="text-sm">
                          {selectedSensor.data.air.overall === "harmful" && 
                            "Air quality is dangerous. Take immediate precautions and minimize exposure."}
                          {selectedSensor.data.air.overall === "poor" && 
                            "Air quality is unhealthy. Consider limiting outdoor activities."}
                          {selectedSensor.data.air.overall === "moderate" && 
                            "Air quality is acceptable but may cause concern for sensitive individuals."}
                          {selectedSensor.data.air.overall === "good" && 
                            "Air quality is satisfactory with minimal health concerns."}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="water" className="pt-4">
                    {selectedSensor.data.water ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="border rounded p-3">
                            <div className="text-sm text-muted-foreground">Turbidity</div>
                            <div className="flex items-center justify-between mt-1">
                              <div className="text-xl font-semibold">
                                {selectedSensor.data.water.turbidity.value} {selectedSensor.data.water.turbidity.unit}
                              </div>
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedSensor.data.water.turbidity.status)}`}></div>
                            </div>
                          </div>
                          
                          <div className="border rounded p-3">
                            <div className="text-sm text-muted-foreground">pH Level</div>
                            <div className="flex items-center justify-between mt-1">
                              <div className="text-xl font-semibold">
                                {selectedSensor.data.water.ph.value} {selectedSensor.data.water.ph.unit}
                              </div>
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedSensor.data.water.ph.status)}`}></div>
                            </div>
                          </div>
                          
                          <div className="border rounded p-3">
                            <div className="text-sm text-muted-foreground">Lead</div>
                            <div className="flex items-center justify-between mt-1">
                              <div className="text-xl font-semibold">
                                {selectedSensor.data.water.lead.value} {selectedSensor.data.water.lead.unit}
                              </div>
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedSensor.data.water.lead.status)}`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-muted p-4 rounded">
                          <h4 className="font-medium mb-1">Interpretation</h4>
                          <p className="text-sm">
                            {selectedSensor.data.water.overall === "harmful" && 
                              "Water quality is dangerous. Do not consume without treatment."}
                            {selectedSensor.data.water.overall === "poor" && 
                              "Water quality is concerning. Filtration recommended before consumption."}
                            {selectedSensor.data.water.overall === "moderate" && 
                              "Water quality is acceptable but monitoring is advised."}
                            {selectedSensor.data.water.overall === "good" && 
                              "Water quality is good and safe for consumption."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[200px]">
                        <p className="text-muted-foreground">No water quality data available for this location</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a sensor to view detailed information
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorMap;
