
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
    <Card className="h-full overflow-hidden border-none shadow-md bg-gradient-to-br from-background to-secondary/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
        <div>
          <CardTitle>Alerts & Notifications</CardTitle>
          <CardDescription>
            Get notified about critical environmental conditions
          </CardDescription>
        </div>
        {activeAlerts.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearAllAlerts} className="whitespace-nowrap">
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {activeAlerts.length > 0 ? (
            <div className="space-y-2 p-4">
              {activeAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-lg transition-all hover:shadow-md ${
                    alert.severity === "high" ? "bg-env-harmful/10 border border-env-harmful/20" : 
                    alert.severity === "medium" ? "bg-env-poor/10 border border-env-poor/20" : 
                    "bg-env-moderate/10 border border-env-moderate/20"
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
            <div className="flex flex-col items-center justify-center h-[360px] text-muted-foreground p-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 opacity-30" />
              </div>
              <p className="font-medium">No active alerts</p>
              <p className="text-sm text-center mt-1">All environmental parameters are within acceptable ranges</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
