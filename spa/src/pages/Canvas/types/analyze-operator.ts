
import { OperatorData, OperatorStatus, OperatorType, AnalysisType, SummaryLength } from './common';

// Define constants for text analysis
export enum TextAnalysisType {
  SENTIMENT = "sentiment",
  LANGUAGE = "language",
  ENTITIES = "entities",
  KEYWORDS = "keywords",
  SUMMARY = "summary",
  ENTITY = "entity",
  KEYWORD = "keyword"
}

export enum TextSummaryLength {
  SHORT = "short",
  MEDIUM = "medium", 
  DETAILED = "detailed"
}

// Define the interface for analyze text operator
export interface AnalyzeTextOperatorData extends OperatorData {
  type: OperatorType.ANALYZE;
  analysisType?: TextAnalysisType | AnalysisType;
  textField?: string;
  options?: {
    summaryLength?: TextSummaryLength | SummaryLength;
    keywordCount?: number;
    extractEntities?: {
      people?: boolean;
      organizations?: boolean;
      locations?: boolean;
      dates?: boolean;
      events?: boolean;
      money?: boolean;
      custom?: string[];
    };
    [key: string]: any;
  };
}
