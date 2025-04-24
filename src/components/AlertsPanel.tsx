
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BellRing, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { getCurrentSensorData, generateAlerts } from "@/services/sensorDataService";

const AlertsPanel = () => {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  
  const { data } = useQuery({
    queryKey: ["sensorData"],
    queryFn: getCurrentSensorData,
    refetchInterval: 3000,
  });
  
  // Generate alerts based on current data
  const alerts = data ? generateAlerts(data) : [];
  
  // Filter out dismissed alerts
  const activeAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.id));
  
  const dismissAlert = (id: string) => {
    setDismissedAlerts(prev => [...prev, id]);
  };
  
  const clearAllAlerts = () => {
    setDismissedAlerts(alerts.map(alert => alert.id));
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-env-harmful text-white";
      case "medium": return "bg-env-poor text-white";
      case "low": return "bg-env-moderate text-black";
      default: return "bg-muted-foreground";
    }
  };
  
  const getTypeIcon = (type: string) => {
    return type === "air" ? (
      <div className="rounded-full bg-env-air bg-opacity-20 p-2">
        <Bell className="h-4 w-4 text-env-air" />
      </div>
    ) : (
      <div className="rounded-full bg-env-water bg-opacity-20 p-2">
        <BellRing className="h-4 w-4 text-env-water" />
      </div>
    );
  };
  
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Alerts & Notifications</CardTitle>
          <CardDescription>
            Get notified about critical environmental conditions
          </CardDescription>
        </div>
        {activeAlerts.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearAllAlerts}>
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {activeAlerts.length > 0 ? (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 border rounded-lg ${
                    alert.severity === "high" ? "border-env-harmful bg-env-harmful/10" : 
                    alert.severity === "medium" ? "border-env-poor bg-env-poor/10" : 
                    "border-env-moderate bg-env-moderate/10"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-start gap-3">
                      {getTypeIcon(alert.type)}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{alert.title}</h4>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {alert.message}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                          <Info className="h-3 w-3 mr-1" />
                          <span>Updated at {formatTime(alert.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" onClick={() => dismissAlert(alert.id)}>
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[360px] text-muted-foreground">
              <Bell className="h-12 w-12 mb-4 opacity-20" />
              <p>No active alerts</p>
              <p className="text-sm">All environmental parameters are within acceptable ranges</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
