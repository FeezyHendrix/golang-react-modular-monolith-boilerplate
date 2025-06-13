import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { loginRequest, verify2FARequest } from "@/api/auth";
import { Shield } from "lucide-react";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      if (showTwoFactor) {
        // Handle 2FA verification
        if (!twoFactorCode) {
          toast({
            title: "Error",
            description: "2FA code is required",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const { data } = await verify2FARequest({ email, code: twoFactorCode });
        if (data) {
          const sessionData = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          };
          localStorage.setItem("session", JSON.stringify(sessionData));
          toast({
            title: "Login successful",
            description: "You are now logged in.",
          });
          navigate("/");
        }
      } else {
        // Handle initial login
        if (!email || !password) {
          toast({
            title: "Error",
            description: "Email and password are required",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        try {
          const { data } = await loginRequest({ email, password });
          if (data) {
            const sessionData = {
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
            };
            localStorage.setItem("session", JSON.stringify(sessionData));
            toast({
              title: "Login successful",
              description: "You are now logged in.",
            });
            navigate("/");
          }
        } catch (error: any) {
          // Check if 2FA is required
          if (error.response?.status === 403) {
            setShowTwoFactor(true);
            toast({
              title: "2FA Required",
              description: "Please enter your 2FA code to continue.",
            });
          } else {
            throw error;
          }
        }
      }
    } catch (e: any) {
      console.error("Login error:", e);
      toast({
        title: "Error",
        description: e.response?.data?.message || "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="h-20 w-20 rounded-full bg-primary-foreground flex items-center justify-center">
          <Shield className="h-10 w-10 text-primary" />
        </div>
        <h1 className="mt-4 text-2xl font-bold">Echo Boilerplate</h1>
        <p className="text-muted-foreground text-sm">Authentication Demo</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {showTwoFactor ? "Enter 2FA Code" : "Sign in to your account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!showTwoFactor ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="twoFactorCode">2FA Code</Label>
                <Input
                  id="twoFactorCode"
                  type="text"
                  placeholder="Enter your 6-digit code"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  disabled={isLoading}
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading 
                ? "Processing..." 
                : showTwoFactor 
                  ? "Verify Code" 
                  : "Sign In"
              }
            </Button>
            
            {showTwoFactor && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => setShowTwoFactor(false)}
                disabled={isLoading}
              >
                Back to Login
              </Button>
            )}
          </form>
        </CardContent>
        {!showTwoFactor && (
          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default SignIn;
