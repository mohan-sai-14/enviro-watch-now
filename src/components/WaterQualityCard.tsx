
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { getCurrentSensorData, thresholds } from "@/services/sensorDataService";
import { AlertTriangle, CheckCircle, HelpCircle, XCircle } from "lucide-react";

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

  const pollutantData = data.water[pollutant];
  const { value, unit, status } = pollutantData;
  
  let statusColor = "";
  let progressValue = 0;
  let StatusIcon = HelpCircle;
  let gradientClass = "";

  // Special case for pH which uses a range
  if (pollutant === "ph") {
    const phValue = parseFloat(value);
    // pH scale is 0-14, with 7 being neutral
    // We'll show how far it is from the ideal range (6.5-8.5)
    progressValue = ((phValue / 14) * 100);
    
    // Different color based on pH range
    if (phValue < 4) {
      statusColor = "bg-env-harmful";
      StatusIcon = XCircle;
      gradientClass = "from-env-harmful/20 to-env-harmful/5";
    }
    else if (phValue < 6) {
      statusColor = "bg-env-poor";
      StatusIcon = AlertTriangle;
      gradientClass = "from-env-poor/20 to-env-poor/5";
    }
    else if (phValue > 10) {
      statusColor = "bg-env-harmful";
      StatusIcon = XCircle;
      gradientClass = "from-env-harmful/20 to-env-harmful/5";
    }
    else if (phValue > 9) {
      statusColor = "bg-env-poor";
      StatusIcon = AlertTriangle;
      gradientClass = "from-env-poor/20 to-env-poor/5";
    }
    else if (phValue < 6.5 || phValue > 8.5) {
      statusColor = "bg-env-moderate";
      StatusIcon = HelpCircle;
      gradientClass = "from-env-moderate/20 to-env-moderate/5";
    }
    else {
      statusColor = "bg-env-good";
      StatusIcon = CheckCircle;
      gradientClass = "from-env-good/20 to-env-good/5";
    }
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

export default WaterQualityCard;
