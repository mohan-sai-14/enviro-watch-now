
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { getCurrentSensorData, thresholds } from "@/services/sensorDataService";

type AirQualityProps = {
  pollutant: "pm25" | "co2" | "no2";
  title: string;
  description: string;
};

const AirQualityCard: React.FC<AirQualityProps> = ({
  pollutant,
  title,
  description,
}) => {
  const { data } = useQuery({
    queryKey: ["sensorData"],
    queryFn: getCurrentSensorData,
    refetchInterval: 3000,
  });

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p>Loading data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pollutantData = data.air[pollutant];
  const { value, unit, status } = pollutantData;
  const thresholdValues = thresholds.air[pollutant];
  
  // Calculate progress percentage based on harmful threshold
  const maxValue = thresholdValues.harmful * 1.5; // Use 150% of harmful threshold as max
  const progressValue = Math.min((parseFloat(value) / maxValue) * 100, 100);
  
  // Determine color based on status
  let statusColor = "";
  switch (status) {
    case "good":
      statusColor = "bg-env-good";
      break;
    case "moderate":
      statusColor = "bg-env-moderate";
      break;
    case "poor":
      statusColor = "bg-env-poor";
      break;
    case "harmful":
      statusColor = "bg-env-harmful";
      break;
    default:
      statusColor = "bg-gray-400";
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          <span className="text-xl font-bold">
            {value} {unit}
          </span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Progress value={progressValue} className={`h-2 ${statusColor}`} />
        </div>
        <div className="flex justify-between text-sm mt-4">
          <span>Low</span>
          <span>Moderate</span>
          <span>High</span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${statusColor}`}></div>
            <p className="text-sm capitalize">
              Status: <span className="font-medium">{status}</span>
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AirQualityCard;
