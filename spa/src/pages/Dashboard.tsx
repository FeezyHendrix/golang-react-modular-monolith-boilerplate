
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  User, 
  Calendar, 
  Settings, 
  LogOut, 
  Key,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    emailConfirmed: true,
    twoFactorEnabled: false,
    lastLogin: new Date().toISOString(),
    isActive: true
  });

  const handleLogout = () => {
    localStorage.removeItem("session");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/login");
  };

  const handleEnable2FA = () => {
    toast({
      title: "2FA Setup",
      description: "2FA setup would be implemented here.",
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-primary-foreground flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Echo Boilerplate</h1>
              <p className="text-muted-foreground">Authentication Dashboard</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Welcome Message */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Welcome back, {user.name}!</h2>
                <p className="text-muted-foreground">
                  You're successfully authenticated and can access the application.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Information */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-sm">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="flex items-center space-x-2">
                  <p className="text-sm">{user.email}</p>
                  {user.emailConfirmed ? (
                    <Badge variant="secondary" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Unverified
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="flex items-center space-x-2">
                  <Badge variant={user.isActive ? "secondary" : "destructive"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Two-Factor Authentication</label>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <Key className="h-4 w-4" />
                    <span className="text-sm">
                      {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    variant={user.twoFactorEnabled ? "destructive" : "default"}
                    onClick={handleEnable2FA}
                  >
                    {user.twoFactorEnabled ? "Disable" : "Enable"} 2FA
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                <div className="flex items-center space-x-2 mt-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {new Date(user.lastLogin).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" className="justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
              <Button variant="outline" className="justify-start">
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Security Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Information */}
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold">Echo Boilerplate Demo</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                This is a demonstration of the authentication system. The boilerplate includes 
                login, signup, 2FA, password reset, and email functionality using Echo (Go) 
                backend with React and shadcn/ui frontend.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
