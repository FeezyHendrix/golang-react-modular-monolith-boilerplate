
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Allow any input (removed length validation)
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Verified successfully",
        description: "You have been logged in successfully.",
      });
      navigate("/");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="h-20 w-20 rounded-full bg-primary-foreground flex items-center justify-center">
          <span className="text-2xl font-bold text-primary">IQ</span>
        </div>
        <h1 className="mt-4 text-2xl font-bold">InsightOne Analytics</h1>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center">
            <Link to="/login" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <CardTitle>Verify OTP</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-center">
              <p className="text-sm text-muted-foreground">
                We've sent a verification code to your email. Please enter the code below.
              </p>
              <div className="flex justify-center py-4">
                <InputOTP
                  value={otp}
                  onChange={setOtp}
                  maxLength={6}
                  render={({ slots }) => (
                    <InputOTPGroup className="gap-3">
                      {slots.map((slot, index) => (
                        <InputOTPSlot 
                          key={index} 
                          {...slot} 
                          index={index} 
                          className="w-12 h-12 text-lg border-input"
                        />
                      ))}
                    </InputOTPGroup>
                  )}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <Button variant="link" className="p-0 h-auto text-primary">
              Resend Code
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyOTP;
