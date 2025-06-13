
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UtilityCardProps {
  selectedUtilityType: string;
  onUtilityTypeChange: (value: string) => void;
}

const UtilityCard: React.FC<UtilityCardProps> = ({
  selectedUtilityType,
  onUtilityTypeChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Utility</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Utility Type</Label>
          <Select value={selectedUtilityType} onValueChange={onUtilityTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select utility type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="delay">Delay</SelectItem>
              <SelectItem value="wait">Scheduled Wait</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedUtilityType === 'delay' && (
          <>
            <div>
              <Label>Delay</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select utility type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5min">5 Minutes</SelectItem>
                  <SelectItem value="15min">15 Minutes</SelectItem>
                  <SelectItem value="30min">30 Minutes</SelectItem>
                  <SelectItem value="1hour">1 Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Duration</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Enter time amount..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {selectedUtilityType === 'wait' && (
          <>
            <div>
              <Label>Scheduled Wait</Label>
              <div>
                <Label>Date and Time</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pick date and time..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="next-week">Next Week</SelectItem>
                    <SelectItem value="next-month">Next Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Timezone</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">EST</SelectItem>
                    <SelectItem value="pst">PST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        <Button className="w-full bg-blue-600 hover:bg-blue-700">Apply Utility</Button>
      </CardContent>
    </Card>
  );
};

export default UtilityCard;
