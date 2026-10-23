import { Investigation, PresetScenario, ExtractedFields, FishboneStructure, FiveWhysStep, MissingEvidenceItem, CAPAItem } from '../types';

const BASE_URL = '/api';

export const api = {
  // Investigations CRUD
  async getInvestigations(filters?: { status?: string; severity?: string; search?: string }): Promise<Investigation[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.severity) params.append('severity', filters.severity);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`${BASE_URL}/investigations?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch investigations');
    return res.json();
  },

  async getInvestigationById(id: number): Promise<Investigation> {
    const res = await fetch(`${BASE_URL}/investigations/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch investigation ${id}`);
    return res.json();
  },

  async createInvestigation(data: Partial<Investigation>): Promise<Investigation> {
    const res = await fetch(`${BASE_URL}/investigations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create investigation');
    return res.json();
  },

  async updateInvestigation(id: number, data: Partial<Investigation>): Promise<Investigation> {
    const res = await fetch(`${BASE_URL}/investigations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update investigation');
    return res.json();
  },

  async deleteInvestigation(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/investigations/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete investigation');
  },

  async qpSignoff(id: number, signoffData: { signer_name: string; signer_role?: string; comments?: string }): Promise<Investigation> {
    const res = await fetch(`${BASE_URL}/investigations/${id}/qp-signoff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signoffData),
    });
    if (!res.ok) throw new Error('Failed to perform QP sign-off');
    return res.json();
  },

  // Presets & PDF Upload
  async getPresets(): Promise<PresetScenario[]> {
    const res = await fetch(`${BASE_URL}/ai/presets`);
    if (!res.ok) throw new Error('Failed to load presets');
    return res.json();
  },

  async getPresetDetail(id: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/ai/presets/${id}`);
    if (!res.ok) throw new Error('Failed to load preset detail');
    return res.json();
  },

  async uploadPdf(file: File): Promise<{ filename: string; extracted_text: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE_URL}/ai/upload-pdf`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload and parse PDF');
    return res.json();
  },

  // AI Stepper Endpoints
  async extractFields(payload: { raw_text: string; source_type?: string; filename?: string; groq_api_key?: string }): Promise<{ extracted_fields: ExtractedFields }> {
    const res = await fetch(`${BASE_URL}/ai/extract-fields`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to extract fields');
    return res.json();
  },

  async analyzeFishbone(payload: { raw_text: string; extracted_fields?: any; groq_api_key?: string }): Promise<{ fishbone_data: FishboneStructure }> {
    const res = await fetch(`${BASE_URL}/ai/analyze-fishbone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to analyze fishbone');
    return res.json();
  },

  async analyzeFiveWhys(payload: { raw_text: string; extracted_fields?: any; fishbone_data?: any; groq_api_key?: string }): Promise<{ five_whys_data: FiveWhysStep[]; suspected_root_cause: string; contributing_factors: string[] }> {
    const res = await fetch(`${BASE_URL}/ai/analyze-five-whys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to analyze 5 Whys');
    return res.json();
  },

  async detectGaps(payload: { raw_text: string; extracted_fields?: any; five_whys_data?: any; suspected_root_cause?: string; groq_api_key?: string }): Promise<{ missing_evidence: MissingEvidenceItem[] }> {
    const res = await fetch(`${BASE_URL}/ai/detect-gaps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to detect evidence gaps');
    return res.json();
  },

  async recommendCapa(payload: { raw_text: string; extracted_fields?: any; five_whys_data?: any; suspected_root_cause?: string; contributing_factors?: string[]; groq_api_key?: string }): Promise<{ capa_recommendations: CAPAItem[]; reasoning_summary: string }> {
    const res = await fetch(`${BASE_URL}/ai/recommend-capa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to recommend CAPA');
    return res.json();
  },

  async runFullPipeline(payload: { raw_text: string; source_type?: string; filename?: string; groq_api_key?: string }): Promise<any> {
    const res = await fetch(`${BASE_URL}/ai/run-full-pipeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to execute full AI pipeline');
    return res.json();
  },

  async copilotChat(payload: { message: string; investigation_context: any; groq_api_key?: string }): Promise<{ reply: string }> {
    const res = await fetch(`${BASE_URL}/ai/copilot-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to chat with copilot');
    return res.json();
  },

  async testGroqKey(apiKey: string): Promise<{ status: string; message?: string }> {
    const res = await fetch(`${BASE_URL}/ai/test-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey }),
    });
    return res.json();
  }
};
