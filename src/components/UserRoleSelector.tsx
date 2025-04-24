
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { userRoles } from "@/services/sensorDataService";

interface UserRoleSelectorProps {
  selectedRole: string;
  onChange: (role: string) => void;
}

const UserRoleSelector: React.FC<UserRoleSelectorProps> = ({
  selectedRole,
  onChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Access Level</CardTitle>
        <CardDescription>
          Select a user role to view different levels of information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          defaultValue={selectedRole} 
          onValueChange={onChange}
          className="space-y-3"
        >
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="public" id="public" />
            <div className="grid gap-1">
              <Label htmlFor="public" className="font-medium">
                Public
              </Label>
              <p className="text-xs text-muted-foreground">
                Basic information suitable for general public awareness
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="authority" id="authority" />
            <div className="grid gap-1">
              <Label htmlFor="authority" className="font-medium">
                Authority
              </Label>
              <p className="text-xs text-muted-foreground">
                Detailed information with recommendations for official decision making
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="researcher" id="researcher" />
            <div className="grid gap-1">
              <Label htmlFor="researcher" className="font-medium">
                Researcher
              </Label>
              <p className="text-xs text-muted-foreground">
                Complete dataset access with scientific analysis tools
              </p>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <div className="w-full text-xs text-muted-foreground">
          <div className="font-medium mb-1">Current Access:</div>
          <div className="space-x-1">
            {userRoles[selectedRole as keyof typeof userRoles].canView.map((item) => (
              <span 
                key={item} 
                className="inline-block bg-secondary text-secondary-foreground px-2 py-1 rounded-sm capitalize mr-1 mb-1"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserRoleSelector;
