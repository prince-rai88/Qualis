import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Investigation, ContainmentAction, FishboneStructure, FiveWhysStep, MissingEvidenceItem, CAPAItem, QPSignoff } from '../../types';
import { api } from '../../services/api';

const defaultFishbone: FishboneStructure = {
  man: [],
  machine: [],
  material: [],
  method: [],
  measurement: [],
  milieu: [],
};

export const emptyInvestigation: Investigation = {
  deviation_number: 'DEV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
  title: '',
  product_name: '',
  batch_number: '',
  manufacturing_step: '',
  equipment_id: '',
  occurrence_date: new Date().toISOString().slice(0, 16),
  reported_by: '',
  department: 'Chemical Synthesis Operations',
  severity: 'Major',
  status: 'Draft',
  deviation_description: '',
  immediate_containment: [],
  investigation_approach: 'both',
  fishbone_data: defaultFishbone,
  five_whys_data: [],
  suspected_root_cause: '',
  contributing_factors: [],
  missing_evidence: [],
  capa_recommendations: [],
  investigator_notes: '',
  qp_signoff: { signed: false, signer_name: '', comments: '' },
};

interface InvestigationState {
  current: Investigation;
  list: Investigation[];
  activeId: number | null;
  loadingList: boolean;
  loadingDetail: boolean;
  saving: boolean;
  error: string | null;
  saveSuccessMessage: string | null;
  activeTab: 'overview' | 'root_cause' | 'evidence' | 'capa';
  currentView: 'home' | 'processing' | 'workspace';
}

const initialState: InvestigationState = {
  current: { ...emptyInvestigation },
  list: [],
  activeId: null,
  loadingList: false,
  loadingDetail: false,
  saving: false,
  error: null,
  saveSuccessMessage: null,
  activeTab: 'overview',
  currentView: 'home',
};

export const fetchInvestigations = createAsyncThunk(
  'investigations/fetchAll',
  async (filters?: { status?: string; severity?: string; search?: string }) => {
    return await api.getInvestigations(filters);
  }
);

export const fetchInvestigationById = createAsyncThunk(
  'investigations/fetchById',
  async (id: number) => {
    return await api.getInvestigationById(id);
  }
);

export const saveCurrentInvestigation = createAsyncThunk(
  'investigations/saveCurrent',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { investigations: InvestigationState };
    const current = state.investigations.current;
    try {
      if (current.id) {
        return await api.updateInvestigation(current.id, current);
      } else {
        return await api.createInvestigation(current);
      }
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to save investigation');
    }
  }
);

export const performQPSignoff = createAsyncThunk(
  'investigations/qpSignoff',
  async ({ id, signoffData }: { id: number; signoffData: { signer_name: string; signer_role?: string; comments?: string } }) => {
    return await api.qpSignoff(id, signoffData);
  }
);

export const deleteInvestigationById = createAsyncThunk(
  'investigations/deleteById',
  async (id: number) => {
    await api.deleteInvestigation(id);
    return id;
  }
);

const investigationSlice = createSlice({
  name: 'investigations',
  initialState,
  reducers: {
    startNewInvestigation(state) {
      state.current = {
        ...emptyInvestigation,
        deviation_number: 'DEV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      };
      state.activeId = null;
      state.activeTab = 'overview';
      state.currentView = 'home';
      state.saveSuccessMessage = null;
    },
    setCurrentView(state, action: PayloadAction<'home' | 'processing' | 'workspace'>) {
      state.currentView = action.payload;
    },
    openInvestigation(state, action: PayloadAction<Investigation>) {
      state.current = action.payload;
      state.activeId = action.payload.id || null;
      state.currentView = 'workspace';
      state.activeTab = 'overview';
    },
    setActiveTab(state, action: PayloadAction<InvestigationState['activeTab']>) {
      state.activeTab = action.payload;
    },
    updateFormField<K extends keyof Investigation>(
      state: InvestigationState,
      action: PayloadAction<{ field: K; value: Investigation[K] }>
    ) {
      (state.current as any)[action.payload.field] = action.payload.value;
    },
    addContainmentAction(state, action: PayloadAction<ContainmentAction>) {
      state.current.immediate_containment.push(action.payload);
    },
    removeContainmentAction(state, action: PayloadAction<number>) {
      state.current.immediate_containment.splice(action.payload, 1);
    },
    toggleContainmentVerified(state, action: PayloadAction<number>) {
      const item = state.current.immediate_containment[action.payload];
      if (item) {
        item.verified = !item.verified;
      }
    },
    setFiveWhys(state, action: PayloadAction<FiveWhysStep[]>) {
      state.current.five_whys_data = action.payload;
    },
    updateFiveWhyStep(state, action: PayloadAction<{ index: number; field: keyof FiveWhysStep; value: any }>) {
      const step = state.current.five_whys_data[action.payload.index];
      if (step) {
        (step as any)[action.payload.field] = action.payload.value;
      }
    },
    setFishboneData(state, action: PayloadAction<FishboneStructure>) {
      state.current.fishbone_data = action.payload;
    },
    updateFishboneItem(
      state,
      action: PayloadAction<{
        branch: keyof FishboneStructure;
        id: string;
        field: keyof FishboneStructure['man'][0];
        value: any;
      }>
    ) {
      const branchItems = state.current.fishbone_data[action.payload.branch];
      const item = branchItems.find((i) => i.id === action.payload.id);
      if (item) {
        (item as any)[action.payload.field] = action.payload.value;
      }
    },
    toggleFishboneConfirmed(state, action: PayloadAction<{ branch: keyof FishboneStructure; id: string }>) {
      const branchItems = state.current.fishbone_data[action.payload.branch];
      const item = branchItems.find((i) => i.id === action.payload.id);
      if (item) {
        item.investigator_confirmed = !item.investigator_confirmed;
      }
    },
    setMissingEvidence(state, action: PayloadAction<MissingEvidenceItem[]>) {
      state.current.missing_evidence = action.payload;
    },
    updateEvidenceGapStatus(state, action: PayloadAction<{ id: string; status: MissingEvidenceItem['status'] }>) {
      const gap = state.current.missing_evidence.find((g) => g.id === action.payload.id);
      if (gap) {
        gap.status = action.payload.status;
      }
    },
    setCAPARecommendations(state, action: PayloadAction<CAPAItem[]>) {
      state.current.capa_recommendations = action.payload;
    },
    addCAPAItem(state, action: PayloadAction<CAPAItem>) {
      state.current.capa_recommendations.push(action.payload);
    },
    updateCAPAItem(state, action: PayloadAction<{ id: string; field: keyof CAPAItem; value: any }>) {
      const capa = state.current.capa_recommendations.find((c) => c.id === action.payload.id);
      if (capa) {
        (capa as any)[action.payload.field] = action.payload.value;
      }
    },
    removeCAPAItem(state, action: PayloadAction<string>) {
      state.current.capa_recommendations = state.current.capa_recommendations.filter((c) => c.id !== action.payload);
    },
    clearSaveSuccess(state) {
      state.saveSuccessMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchInvestigations.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(fetchInvestigations.fulfilled, (state, action) => {
        state.loadingList = false;
        state.list = action.payload;
      })
      .addCase(fetchInvestigations.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.error.message || 'Failed to fetch investigations';
      })
      // Fetch By Id
      .addCase(fetchInvestigationById.pending, (state) => {
        state.loadingDetail = true;
      })
      .addCase(fetchInvestigationById.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.current = action.payload;
        state.activeId = action.payload.id || null;
        state.currentView = 'workspace';
        state.activeTab = 'overview';
      })
      .addCase(fetchInvestigationById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.error.message || 'Failed to load investigation';
      })
      // Save
      .addCase(saveCurrentInvestigation.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.saveSuccessMessage = null;
      })
      .addCase(saveCurrentInvestigation.fulfilled, (state, action) => {
        state.saving = false;
        state.current = action.payload;
        state.activeId = action.payload.id || null;
        state.saveSuccessMessage = `Investigation ${action.payload.deviation_number} saved successfully!`;
        // Update list
        const idx = state.list.findIndex((i) => i.id === action.payload.id);
        if (idx >= 0) {
          state.list[idx] = action.payload;
        } else {
          state.list.unshift(action.payload);
        }
      })
      .addCase(saveCurrentInvestigation.rejected, (state, action) => {
        state.saving = false;
        state.error = (action.payload as string) || 'Failed to save';
      })
      // QP Signoff
      .addCase(performQPSignoff.fulfilled, (state, action) => {
        state.current = action.payload;
        const idx = state.list.findIndex((i) => i.id === action.payload.id);
        if (idx >= 0) state.list[idx] = action.payload;
      })
      // Delete
      .addCase(deleteInvestigationById.fulfilled, (state, action) => {
        state.list = state.list.filter((i) => i.id !== action.payload);
        if (state.activeId === action.payload) {
          if (state.list.length > 0) {
            state.current = state.list[0];
            state.activeId = state.list[0].id || null;
          } else {
            state.current = { ...emptyInvestigation };
            state.activeId = null;
          }
        }
      });
  },
});

export const {
  startNewInvestigation,
  setCurrentView,
  openInvestigation,
  setActiveTab,
  updateFormField,
  addContainmentAction,
  removeContainmentAction,
  toggleContainmentVerified,
  setFiveWhys,
  updateFiveWhyStep,
  setFishboneData,
  updateFishboneItem,
  toggleFishboneConfirmed,
  setMissingEvidence,
  updateEvidenceGapStatus,
  setCAPARecommendations,
  addCAPAItem,
  updateCAPAItem,
  removeCAPAItem,
  clearSaveSuccess,
} = investigationSlice.actions;

export default investigationSlice.reducer;
