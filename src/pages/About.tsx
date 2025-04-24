
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const About = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">About EnviroWatch Now</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
          <CardDescription>
            Environmental monitoring in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            EnviroWatch Now is a real-time environmental monitoring platform designed to track and
            visualize air and water quality data across urban and natural environments. The platform
            provides intuitive visualizations of complex environmental data to help users make
            informed decisions about their health and safety.
          </p>
          <p>
            This project was developed for the Environmental Hackathon 2025, focusing on innovative
            ways to make environmental data more accessible and actionable for communities, authorities,
            and researchers.
          </p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Air Quality Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-medium mb-2">Key Pollutants Tracked:</h3>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>
                <span className="font-medium">PM2.5</span> - Fine particulate matter that can penetrate 
                deep into the lungs and even enter the bloodstream
              </li>
              <li>
                <span className="font-medium">CO2</span> - Carbon dioxide, a greenhouse gas that can 
                accumulate in enclosed spaces
              </li>
              <li>
                <span className="font-medium">NO2</span> - Nitrogen dioxide, primarily from vehicle 
                emissions and industrial processes
              </li>
            </ul>
            
            <Separator className="my-4" />
            
            <h3 className="font-medium mb-2">Health Impacts:</h3>
            <p className="text-sm">
              Exposure to poor air quality can cause respiratory issues, cardiovascular problems, 
              and long-term health effects. Our real-time monitoring helps users take precautionary 
              measures when air quality deteriorates.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Water Quality Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-medium mb-2">Key Parameters Tracked:</h3>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>
                <span className="font-medium">Turbidity</span> - A measure of water clarity that affects 
                aquatic life and can indicate contamination
              </li>
              <li>
                <span className="font-medium">pH Level</span> - Indicates acidity or alkalinity of water, 
                affecting its safety and ecosystem health
              </li>
              <li>
                <span className="font-medium">Lead</span> - A toxic heavy metal that can leach into water 
                supply from aging infrastructure
              </li>
            </ul>
            
            <Separator className="my-4" />
            
            <h3 className="font-medium mb-2">Safety Implications:</h3>
            <p className="text-sm">
              Clean water is essential for human health. Our monitoring system alerts users to potential 
              contaminants in water sources, allowing for timely interventions to protect public health.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Technical Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            For this demo, environmental data is simulated to showcase the platform's capabilities.
            In a production environment, this system would connect to a network of IoT sensors
            deployed throughout the monitored area.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Technologies Used:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>React with TypeScript</li>
                <li>Tailwind CSS for responsive design</li>
                <li>React Query for data fetching and state management</li>
                <li>Recharts for data visualization</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Future Enhancements:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Integration with actual IoT sensor networks</li>
                <li>Machine learning for predictive pollution forecasting</li>
                <li>Mobile app with push notifications</li>
                <li>Expanded coverage of additional pollutants</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
