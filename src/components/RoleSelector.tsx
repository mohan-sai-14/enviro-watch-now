
import React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { userRoles } from "@/services/sensorDataService";

interface RoleSelectorProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleChange,
}) => {
  const roleOptions = Object.keys(userRoles);
  
  const roleLabels: Record<string, string> = {
    public: "Public User",
    researcher: "Researcher",
    admin: "Administrator",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto flex justify-between items-center">
          <span>View as: {roleLabels[selectedRole]}</span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        {roleOptions.map((role) => (
          <DropdownMenuItem
            key={role}
            className={cn(
              "cursor-pointer flex items-center justify-between",
              selectedRole === role && "bg-accent"
            )}
            onClick={() => onRoleChange(role)}
          >
            <span>{roleLabels[role]}</span>
            {selectedRole === role && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleSelector;
