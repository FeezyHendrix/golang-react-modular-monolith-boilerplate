
import React from "react";
import { useDecisioning } from "./hooks/useDecisioning";
import DataSelectionSidebar from "./components/DataSelectionSidebar";
import DecisioningHeader from "./components/DecisioningHeader";
import MainContent from "./components/MainContent";
import ChatInput from "./components/ChatInput";
import SaveDialog from "./components/SaveDialog";
import ShareDialog from "./components/ShareDialog";

const Decisioning: React.FC = () => {
  const {
    message,
    setMessage,
    showDataSelection,
    setShowDataSelection,
    showDocSelection,
    setShowDocSelection,
    showSaveDialog,
    setShowSaveDialog,
    showShareDialog,
    setShowShareDialog,
    isProcessingData,
    setIsProcessingData,
    isProcessingDoc,
    setIsProcessingDoc,
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
    dataSources,
    savedQueries,
    documents,
    insights,
    filteredUsers,
    handleSubmit,
    handleDataSourceToggle,
    handleQueryToggle,
    handleDocumentToggle,
    handleProcessData,
    handleProcessDoc,
    handleSave,
    handleSaveConfirm,
    handleShare,
    handleShareConfirm,
    handleRefresh,
    hasAnyItemSelected
  } = useDecisioning();

  return (
    <div className="flex h-full">
      <DataSelectionSidebar 
        dataSources={dataSources}
        savedQueries={savedQueries}
        documents={documents}
        showDataSelection={showDataSelection}
        setShowDataSelection={setShowDataSelection}
        showDocSelection={showDocSelection}
        setShowDocSelection={setShowDocSelection}
        isProcessingData={isProcessingData}
        setIsProcessingData={setIsProcessingData}
        isProcessingDoc={isProcessingDoc}
        setIsProcessingDoc={setIsProcessingDoc}
        handleDataSourceToggle={handleDataSourceToggle}
        handleQueryToggle={handleQueryToggle}
        handleDocumentToggle={handleDocumentToggle}
        handleProcessData={handleProcessData}
        handleProcessDoc={handleProcessDoc}
        insights={insights}
      />
      
      <div className="flex-1 flex flex-col h-full">
        <DecisioningHeader 
          handleSave={handleSave}
          handleShare={handleShare}
          handleRefresh={handleRefresh}
        />
        
        <MainContent 
          hasAnyItemSelected={hasAnyItemSelected()}
          isProcessingData={isProcessingData}
          isProcessingDoc={isProcessingDoc}
          setMessage={setMessage}
          dataSources={dataSources}
          documents={documents}
        />
        
        <ChatInput 
          message={message}
          setMessage={setMessage}
          handleSubmit={handleSubmit}
          hasAnyItemSelected={hasAnyItemSelected()}
          isProcessingData={isProcessingData}
          isProcessingDoc={isProcessingDoc}
        />
      </div>
      
      <SaveDialog 
        showSaveDialog={showSaveDialog}
        setShowSaveDialog={setShowSaveDialog}
        insightName={insightName}
        setInsightName={setInsightName}
        insightDescription={insightDescription}
        setInsightDescription={setInsightDescription}
        insightCategory={insightCategory}
        setInsightCategory={setInsightCategory}
        insightPriority={insightPriority}
        setInsightPriority={setInsightPriority}
        handleSaveConfirm={handleSaveConfirm}
      />
      
      <ShareDialog 
        showShareDialog={showShareDialog}
        setShowShareDialog={setShowShareDialog}
        searchUser={searchUser}
        setSearchUser={setSearchUser}
        filteredUsers={filteredUsers}
        handleShareConfirm={handleShareConfirm}
      />
    </div>
  );
};

export default Decisioning;
