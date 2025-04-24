
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { getCurrentSensorData, getRecommendations } from "@/services/sensorDataService";

interface RecommendationsPanelProps {
  userRole: string;
}

const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({ userRole }) => {
  const { data } = useQuery({
    queryKey: ["sensorData"],
    queryFn: getCurrentSensorData,
    refetchInterval: 3000,
  });
  
  const recommendations = data ? getRecommendations(data, userRole) : [];
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
        <CardDescription>
          Suggested actions based on current environmental conditions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[160px] text-muted-foreground">
              <p>No recommendations at this time</p>
              <p className="text-sm">All environmental parameters are within acceptable ranges</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecommendationsPanel;
