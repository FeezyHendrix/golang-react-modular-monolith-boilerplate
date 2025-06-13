
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Insight, User } from "../types";

export const useInsightManagement = () => {
  const { toast } = useToast();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [insightName, setInsightName] = useState("");
  const [insightDescription, setInsightDescription] = useState("");
  const [insightCategory, setInsightCategory] = useState("");
  const [insightPriority, setInsightPriority] = useState("Medium");
  const [searchUser, setSearchUser] = useState("");
  
  const [insights, setInsights] = useState<Insight[]>([
    { id: 1, title: "Sales Growth Opportunity", description: "Product line X shows 32% growth potential in the Northwest region.", category: "Sales", priority: "High" },
    { id: 2, title: "Cost Reduction", description: "Optimizing supplier contracts could reduce COGS by 8%.", category: "Finance", priority: "Medium" },
  ]);

  const [users] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Analyst" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "Manager" },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", role: "Viewer" },
  ]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchUser.toLowerCase()) || 
    user.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  const handleSave = () => {
    setInsightName("Customer Retention Strategy");
    setInsightDescription("Analysis indicates a 15% churn risk in enterprise segment. Recommended actions include targeted outreach and loyalty program adjustments.");
    setShowSaveDialog(true);
  };
  
  const handleSaveConfirm = () => {
    if (!insightCategory) {
      toast({
        title: "Missing information",
        description: "Please enter a category for this insight.",
        variant: "destructive"
      });
      return;
    }
    
    const newInsight = {
      id: insights.length + 1,
      title: insightName,
      description: insightDescription,
      category: insightCategory,
      priority: insightPriority
    };
    
    setInsights([newInsight, ...insights.slice(0, 1)]);
    
    toast({
      title: "Insight saved",
      description: "Your insight has been saved and is available in Reports."
    });
    
    setShowSaveDialog(false);
    setInsightName("");
    setInsightDescription("");
    setInsightCategory("");
    setInsightPriority("Medium");
  };
  
  const handleShare = () => {
    setShowShareDialog(true);
  };
  
  const handleShareConfirm = () => {
    toast({
      title: "Shared successfully",
      description: "This insight has been shared with selected users."
    });
    setShowShareDialog(false);
    setSearchUser("");
  };

  return {
    showSaveDialog,
    setShowSaveDialog,
    showShareDialog,
    setShowShareDialog,
    insightName,
    setInsightName,
    insightDescription,
    setInsightDescription,
    insightCategory,
    setInsightCategory,
    insightPriority,
    setInsightPriority,
    searchUser,
    setSearchUser,
    insights,
    users,
    filteredUsers,
    handleSave,
    handleSaveConfirm,
    handleShare,
    handleShareConfirm
  };
};
