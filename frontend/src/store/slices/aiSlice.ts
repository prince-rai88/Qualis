import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ExtractedFields, FishboneStructure, FiveWhysStep, MissingEvidenceItem, CAPAItem, PresetScenario } from '../../types';
import { api } from '../../services/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
}

interface AIState {
  rawInputText: string;
  sourceType: 'text' | 'pdf' | 'email';
  filename: string | null;
  presets: PresetScenario[];
  activePresetId: string | null;
  groqApiKey: string;
  groqModel: string;
  isGroqConnected: boolean;
  testingKey: boolean;
  keyStatusMessage: string | null;

  // Pipeline execution state
  currentStep: number; // 1: Extract, 2: Fishbone, 3: 5 Whys, 4: Gaps, 5: CAPA
  isProcessing: boolean;
  processingTask: string;
  progressPercent: number;
  error: string | null;

  // AI Generated Results
  extractedFields: ExtractedFields | null;
  appliedFieldKeys: string[];
  aiFishbone: FishboneStructure | null;
  aiFiveWhys: FiveWhysStep[] | null;
  aiSuspectedRootCause: string | null;
  aiContributingFactors: string[];
  aiMissingEvidence: MissingEvidenceItem[] | null;
  aiCapaRecommendations: CAPAItem[] | null;
  aiReasoningSummary: string | null;

  // Quality Copilot Chat
  chatMessages: ChatMessage[];
  chatLoading: boolean;
}

const savedKey = typeof window !== 'undefined' ? localStorage.getItem('qualis_groq_api_key') || '' : '';

const initialState: AIState = {
  rawInputText: '',
  sourceType: 'text',
  filename: null,
  presets: [],
  activePresetId: null,
  groqApiKey: savedKey,
  groqModel: 'llama-3.3-70b-versatile',
  isGroqConnected: false,
  testingKey: false,
  keyStatusMessage: null,

  currentStep: 1,
  isProcessing: false,
  processingTask: '',
  progressPercent: 0,
  error: null,

  extractedFields: null,
  appliedFieldKeys: [],
  aiFishbone: null,
  aiFiveWhys: null,
  aiSuspectedRootCause: null,
  aiContributingFactors: [],
  aiMissingEvidence: null,
  aiCapaRecommendations: null,
  aiReasoningSummary: null,

  chatMessages: [
    {
      id: 'welcome-1',
      sender: 'copilot',
      text: 'Hello. I am your cGMP Quality Copilot. Upload an incident document, paste an email, or select an API preset scenario to begin root cause investigation.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ],
  chatLoading: false,
};

export const loadPresetsList = createAsyncThunk('ai/loadPresets', async () => {
  return await api.getPresets();
});

export const loadPresetData = createAsyncThunk('ai/loadPresetData', async (presetId: string) => {
  return await api.getPresetDetail(presetId);
});

export const uploadPdfFile = createAsyncThunk('ai/uploadPdf', async (file: File) => {
  return await api.uploadPdf(file);
});

export const testGroqApiKey = createAsyncThunk('ai/testGroqKey', async (key: string) => {
  return await api.testGroqKey(key);
});

// Step 1: Extract
export const runAIExtraction = createAsyncThunk(
  'ai/extract',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { ai: AIState };
    try {
      const res = await api.extractFields({
        raw_text: state.ai.rawInputText,
        source_type: state.ai.sourceType,
        filename: state.ai.filename || undefined,
        groq_api_key: state.ai.groqApiKey || undefined,
      });
      return res.extracted_fields;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Extraction failed');
    }
  }
);

// Step 2: Fishbone
export const runAIFishbone = createAsyncThunk(
  'ai/fishbone',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { ai: AIState };
    try {
      const res = await api.analyzeFishbone({
        raw_text: state.ai.rawInputText,
        extracted_fields: state.ai.extractedFields,
        groq_api_key: state.ai.groqApiKey || undefined,
      });
      return res.fishbone_data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Fishbone analysis failed');
    }
  }
);

// Step 3: 5 Whys
export const runAIFiveWhys = createAsyncThunk(
  'ai/fiveWhys',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { ai: AIState };
    try {
      const res = await api.analyzeFiveWhys({
        raw_text: state.ai.rawInputText,
        extracted_fields: state.ai.extractedFields,
        fishbone_data: state.ai.aiFishbone,
        groq_api_key: state.ai.groqApiKey || undefined,
      });
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || '5 Whys analysis failed');
    }
  }
);

// Step 4: Gaps
export const runAIGaps = createAsyncThunk(
  'ai/gaps',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { ai: AIState };
    try {
      const res = await api.detectGaps({
        raw_text: state.ai.rawInputText,
        extracted_fields: state.ai.extractedFields,
        five_whys_data: state.ai.aiFiveWhys,
        suspected_root_cause: state.ai.aiSuspectedRootCause || undefined,
        groq_api_key: state.ai.groqApiKey || undefined,
      });
      return res.missing_evidence;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Evidence gap detection failed');
    }
  }
);

// Step 5: CAPA
export const runAICapa = createAsyncThunk(
  'ai/capa',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { ai: AIState };
    try {
      const res = await api.recommendCapa({
        raw_text: state.ai.rawInputText,
        extracted_fields: state.ai.extractedFields,
        five_whys_data: state.ai.aiFiveWhys,
        suspected_root_cause: state.ai.aiSuspectedRootCause || undefined,
        contributing_factors: state.ai.aiContributingFactors,
        groq_api_key: state.ai.groqApiKey || undefined,
      });
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || 'CAPA formulation failed');
    }
  }
);

// Full Pipeline In One Shot
export const runAIFullPipeline = createAsyncThunk(
  'ai/fullPipeline',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { ai: AIState };
    try {
      const res = await api.runFullPipeline({
        raw_text: state.ai.rawInputText,
        source_type: state.ai.sourceType,
        filename: state.ai.filename || undefined,
        groq_api_key: state.ai.groqApiKey || undefined,
      });
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Full pipeline failed');
    }
  }
);

export const sendCopilotMessage = createAsyncThunk(
  'ai/copilotChat',
  async (
    { message, context }: { message: string; context: any },
    { getState }
  ) => {
    const state = getState() as { ai: AIState };
    const res = await api.copilotChat({
      message,
      investigation_context: context,
      groq_api_key: state.ai.groqApiKey || undefined,
    });
    return { userMsg: message, botReply: res.reply };
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setInputText(state, action: PayloadAction<string>) {
      state.rawInputText = action.payload;
    },
    setSourceType(state, action: PayloadAction<AIState['sourceType']>) {
      state.sourceType = action.payload;
    },
    setCurrentStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },
    setGroqApiKey(state, action: PayloadAction<string>) {
      state.groqApiKey = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('qualis_groq_api_key', action.payload);
      }
    },
    setGroqModel(state, action: PayloadAction<string>) {
      state.groqModel = action.payload;
    },
    markFieldApplied(state, action: PayloadAction<string>) {
      if (!state.appliedFieldKeys.includes(action.payload)) {
        state.appliedFieldKeys.push(action.payload);
      }
    },
    markAllFieldsApplied(state, action: PayloadAction<string[]>) {
      state.appliedFieldKeys = Array.from(new Set([...state.appliedFieldKeys, ...action.payload]));
    },
    resetAppliedFields(state) {
      state.appliedFieldKeys = [];
    },
    clearAIState(state) {
      state.extractedFields = null;
      state.appliedFieldKeys = [];
      state.aiFishbone = null;
      state.aiFiveWhys = null;
      state.aiSuspectedRootCause = null;
      state.aiContributingFactors = [];
      state.aiMissingEvidence = null;
      state.aiCapaRecommendations = null;
      state.aiReasoningSummary = null;
      state.currentStep = 1;
      state.progressPercent = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Presets
      .addCase(loadPresetsList.fulfilled, (state, action) => {
        state.presets = action.payload;
      })
      .addCase(loadPresetData.fulfilled, (state, action) => {
        const preset = action.payload;
        state.activePresetId = preset.id;
        state.rawInputText = preset.raw_text;
        state.sourceType = 'text';
        state.filename = `${preset.id}_report.txt`;

        // Load precomputed analysis for instant preview
        if (preset.mock_analysis) {
          const m = preset.mock_analysis;
          state.extractedFields = m.extracted_fields;
          state.aiFishbone = m.fishbone;
          state.aiFiveWhys = m.five_whys;
          state.aiSuspectedRootCause = m.suspected_root_cause;
          state.aiContributingFactors = m.contributing_factors;
          state.aiMissingEvidence = m.missing_evidence;
          state.aiCapaRecommendations = m.capa_recommendations;
          state.aiReasoningSummary = m.reasoning_summary;
          state.currentStep = 5;
          state.progressPercent = 100;
        }
      })
      // Upload PDF
      .addCase(uploadPdfFile.pending, (state) => {
        state.isProcessing = true;
        state.processingTask = 'Parsing and extracting PDF text...';
      })
      .addCase(uploadPdfFile.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.rawInputText = action.payload.extracted_text;
        state.filename = action.payload.filename;
        state.sourceType = 'pdf';
      })
      .addCase(uploadPdfFile.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.error.message || 'PDF parse error';
      })
      // Test Groq Key
      .addCase(testGroqApiKey.pending, (state) => {
        state.testingKey = true;
        state.keyStatusMessage = null;
      })
      .addCase(testGroqApiKey.fulfilled, (state, action) => {
        state.testingKey = false;
        if (action.payload.status === 'success') {
          state.isGroqConnected = true;
          state.keyStatusMessage = 'Connected to Groq LLM successfully!';
        } else {
          state.isGroqConnected = false;
          state.keyStatusMessage = action.payload.message || 'Key verification failed';
        }
      })
      .addCase(testGroqApiKey.rejected, (state, action) => {
        state.testingKey = false;
        state.isGroqConnected = false;
        state.keyStatusMessage = action.error.message || 'Connection failed';
      })
      // Extraction
      .addCase(runAIExtraction.pending, (state) => {
        state.isProcessing = true;
        state.processingTask = 'Extracting cGMP deviation metadata & containment actions...';
        state.progressPercent = 20;
      })
      .addCase(runAIExtraction.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.extractedFields = action.payload;
        state.currentStep = 2;
        state.progressPercent = 25;
      })
      .addCase(runAIExtraction.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = (action.payload as string) || 'Extraction failed';
      })
      // Fishbone
      .addCase(runAIFishbone.pending, (state) => {
        state.isProcessing = true;
        state.processingTask = 'Mapping causal factors across Ishikawa 6M categories...';
        state.progressPercent = 40;
      })
      .addCase(runAIFishbone.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.aiFishbone = action.payload;
        state.currentStep = 3;
        state.progressPercent = 50;
      })
      .addCase(runAIFishbone.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = (action.payload as string) || 'Fishbone failed';
      })
      // 5 Whys
      .addCase(runAIFiveWhys.pending, (state) => {
        state.isProcessing = true;
        state.processingTask = 'Building 5 Whys causal interrogation chain to systemic root cause...';
        state.progressPercent = 60;
      })
      .addCase(runAIFiveWhys.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.aiFiveWhys = action.payload.five_whys_data;
        state.aiSuspectedRootCause = action.payload.suspected_root_cause;
        state.aiContributingFactors = action.payload.contributing_factors;
        state.currentStep = 4;
        state.progressPercent = 70;
      })
      .addCase(runAIFiveWhys.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = (action.payload as string) || '5 Whys failed';
      })
      // Gaps
      .addCase(runAIGaps.pending, (state) => {
        state.isProcessing = true;
        state.processingTask = 'Detecting missing evidence & 21 CFR 211.192 regulatory gaps...';
        state.progressPercent = 80;
      })
      .addCase(runAIGaps.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.aiMissingEvidence = action.payload;
        state.currentStep = 5;
        state.progressPercent = 85;
      })
      .addCase(runAIGaps.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = (action.payload as string) || 'Gaps failed';
      })
      // CAPA
      .addCase(runAICapa.pending, (state) => {
        state.isProcessing = true;
        state.processingTask = 'Formulating ICH Q10 Corrective & Preventive Actions with effectiveness metrics...';
        state.progressPercent = 95;
      })
      .addCase(runAICapa.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.aiCapaRecommendations = action.payload.capa_recommendations;
        state.aiReasoningSummary = action.payload.reasoning_summary;
        state.progressPercent = 100;
      })
      .addCase(runAICapa.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = (action.payload as string) || 'CAPA failed';
      })
      // Full Pipeline
      .addCase(runAIFullPipeline.pending, (state) => {
        state.isProcessing = true;
        state.processingTask = 'Executing full LangGraph RCA pipeline (Intake → Fishbone → 5 Whys → Gaps → CAPA)...';
        state.progressPercent = 15;
      })
      .addCase(runAIFullPipeline.fulfilled, (state, action) => {
        state.isProcessing = false;
        const res = action.payload;
        state.extractedFields = res.extracted_fields;
        state.aiFishbone = res.fishbone_data;
        state.aiFiveWhys = res.five_whys_data;
        state.aiSuspectedRootCause = res.suspected_root_cause;
        state.aiContributingFactors = res.contributing_factors || [];
        state.aiMissingEvidence = res.missing_evidence;
        state.aiCapaRecommendations = res.capa_recommendations;
        state.aiReasoningSummary = res.reasoning_summary;
        state.currentStep = 5;
        state.progressPercent = 100;
      })
      .addCase(runAIFullPipeline.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = (action.payload as string) || 'Pipeline execution failed';
      })
      // Copilot Chat
      .addCase(sendCopilotMessage.pending, (state, action) => {
        state.chatLoading = true;
        state.chatMessages.push({
          id: 'user-' + Date.now(),
          sender: 'user',
          text: action.meta.arg.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      })
      .addCase(sendCopilotMessage.fulfilled, (state, action) => {
        state.chatLoading = false;
        state.chatMessages.push({
          id: 'copilot-' + Date.now(),
          sender: 'copilot',
          text: action.payload.botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      })
      .addCase(sendCopilotMessage.rejected, (state, action) => {
        state.chatLoading = false;
        state.chatMessages.push({
          id: 'copilot-err-' + Date.now(),
          sender: 'copilot',
          text: 'I encountered an error querying the regulatory engine. Please check your network or Groq key.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      });
  },
});

export const {
  setInputText,
  setSourceType,
  setCurrentStep,
  setGroqApiKey,
  setGroqModel,
  markFieldApplied,
  markAllFieldsApplied,
  resetAppliedFields,
  clearAIState,
} = aiSlice.actions;

export default aiSlice.reducer;
