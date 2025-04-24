
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { getCurrentSensorData, thresholds } from "@/services/sensorDataService";
import { AlertTriangle, CheckCircle, HelpCircle, XCircle } from "lucide-react";

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
      <Card className="overflow-hidden border border-dashed animate-pulse">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <div className="h-6 w-16 bg-muted rounded"></div>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="h-2 bg-muted rounded w-full"></div>
          </div>
          <div className="flex justify-between text-sm mt-4 text-muted-foreground">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
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
  let StatusIcon = HelpCircle;
  let gradientClass = "";
  
  switch (status) {
    case "good":
      statusColor = "bg-env-good";
      StatusIcon = CheckCircle;
      gradientClass = "from-env-good/20 to-env-good/5";
      break;
    case "moderate":
      statusColor = "bg-env-moderate";
      StatusIcon = HelpCircle;
      gradientClass = "from-env-moderate/20 to-env-moderate/5";
      break;
    case "poor":
      statusColor = "bg-env-poor";
      StatusIcon = AlertTriangle;
      gradientClass = "from-env-poor/20 to-env-poor/5";
      break;
    case "harmful":
      statusColor = "bg-env-harmful";
      StatusIcon = XCircle;
      gradientClass = "from-env-harmful/20 to-env-harmful/5";
      break;
    default:
      statusColor = "bg-gray-400";
      gradientClass = "from-gray-200 to-gray-100";
  }

  return (
    <Card className={`h-full overflow-hidden bg-gradient-to-br ${gradientClass} transition-all hover:shadow-md`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          <span className="text-xl font-bold">
            {value} <span className="text-sm font-normal">{unit}</span>
          </span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Progress value={progressValue} className={`h-2 ${statusColor}`} />
        </div>
        <div className="flex justify-between text-sm mt-4 text-muted-foreground">
          <span>Low</span>
          <span>Moderate</span>
          <span>High</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        <div className="w-full">
          <div className="flex items-center">
            <StatusIcon className={`h-5 w-5 mr-2 ${
              status === "good" ? "text-env-good" :
              status === "moderate" ? "text-env-moderate" :
              status === "poor" ? "text-env-poor" :
              "text-env-harmful"
            }`} />
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
