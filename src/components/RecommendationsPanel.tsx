
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { getCurrentSensorData, getRecommendations } from "@/services/sensorDataService";
import { Info, Lightbulb } from "lucide-react";

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
    <Card className="h-full bg-gradient-to-br from-background to-secondary/30 border-none shadow-md">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-env-moderate" />
          <CardTitle>Recommendations</CardTitle>
        </div>
        <CardDescription>
          Suggested actions based on current environmental conditions
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {recommendations.length > 0 ? (
            <div className="space-y-3 p-4">
              {recommendations.map((rec) => (
                <div 
                  key={rec.id} 
                  className="p-4 rounded-lg border border-muted bg-card hover:shadow-sm transition-all"
                >
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    {rec.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[360px] text-muted-foreground p-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Lightbulb className="h-8 w-8 opacity-30" />
              </div>
              <p className="font-medium">No recommendations</p>
              <p className="text-sm text-center mt-1">All environmental parameters are within acceptable ranges</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecommendationsPanel;
