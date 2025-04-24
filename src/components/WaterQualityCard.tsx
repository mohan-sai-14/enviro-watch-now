
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { getCurrentSensorData, thresholds } from "@/services/sensorDataService";

type WaterQualityProps = {
  pollutant: "turbidity" | "ph" | "lead";
  title: string;
  description: string;
};

const WaterQualityCard: React.FC<WaterQualityProps> = ({
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

  const pollutantData = data.water[pollutant];
  const { value, unit, status } = pollutantData;
  
  let statusColor = "";
  let progressValue = 0;

  // Special case for pH which uses a range
  if (pollutant === "ph") {
    const phValue = parseFloat(value);
    // pH scale is 0-14, with 7 being neutral
    // We'll show how far it is from the ideal range (6.5-8.5)
    progressValue = ((phValue / 14) * 100);
    
    // Different color based on pH range
    if (phValue < 4) statusColor = "bg-env-harmful";
    else if (phValue < 6) statusColor = "bg-env-poor";
    else if (phValue > 10) statusColor = "bg-env-harmful";
    else if (phValue > 9) statusColor = "bg-env-poor";
    else if (phValue < 6.5 || phValue > 8.5) statusColor = "bg-env-moderate";
    else statusColor = "bg-env-good";
  } else {
    // For other pollutants
    const thresholdValues = thresholds.water[pollutant];
    const maxValue = thresholdValues.harmful * 1.5; // Use 150% of harmful threshold as max
    const numValue = parseFloat(value);
    progressValue = Math.min((numValue / maxValue) * 100, 100);
    
    // Color based on status
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
          {pollutant === "ph" ? (
            <>
              <span>Acidic (0)</span>
              <span>Neutral (7)</span>
              <span>Alkaline (14)</span>
            </>
          ) : (
            <>
              <span>Low</span>
              <span>Moderate</span>
              <span>High</span>
            </>
          )}
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

export default WaterQualityCard;
