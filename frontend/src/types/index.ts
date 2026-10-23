export interface ContainmentAction {
  id?: string;
  description: string;
  action_type?: string;
  taken_by?: string;
  timestamp?: string;
  verified?: boolean;
}

export interface FishboneCause {
  id: string;
  text: string;
  likelihood: 'High' | 'Medium' | 'Low' | 'Ruled Out';
  is_contributing: boolean;
  is_root_cause: boolean;
  evidence?: string;
  ai_suggested: boolean;
  investigator_confirmed: boolean;
}

export interface FishboneStructure {
  man: FishboneCause[];
  machine: FishboneCause[];
  material: FishboneCause[];
  method: FishboneCause[];
  measurement: FishboneCause[];
  milieu: FishboneCause[];
}

export interface FiveWhysStep {
  step: number;
  question: string;
  answer: string;
  evidence?: string;
  is_root_cause: boolean;
  confidence?: number;
  confirmed: boolean;
}

export interface MissingEvidenceItem {
  id: string;
  item: string;
  rationale: string;
  source_department?: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Provided' | 'Waived';
}

export interface CAPAItem {
  id: string;
  capa_type: 'Corrective' | 'Preventive';
  title: string;
  description: string;
  root_cause_addressed?: string;
  owner: string;
  target_date?: string;
  effectiveness_criteria: string;
  status: 'Proposed' | 'Approved' | 'In Progress' | 'Completed';
  ai_suggested: boolean;
  confirmed: boolean;
}

export interface QPSignoff {
  signed: boolean;
  signer_name?: string;
  signer_role?: string;
  signed_at?: string;
  comments?: string;
}

export interface ExtractedFields {
  deviation_number?: string;
  title?: string;
  product_name?: string;
  batch_number?: string;
  manufacturing_step?: string;
  equipment_id?: string;
  occurrence_date?: string;
  reported_by?: string;
  department?: string;
  severity?: 'Minor' | 'Major' | 'Critical';
  deviation_description?: string;
  immediate_containment?: ContainmentAction[];
  confidence_scores?: Record<string, number>;
  evidence_citations?: Record<string, string>;
}

export interface Investigation {
  id?: number;
  deviation_number: string;
  title: string;
  product_name: string;
  batch_number: string;
  manufacturing_step: string;
  equipment_id: string;
  occurrence_date: string;
  reported_by: string;
  department: string;
  severity: 'Minor' | 'Major' | 'Critical';
  status: 'Draft' | 'In Investigation' | 'Under QA Review' | 'CAPA Approved' | 'Closed';
  deviation_description: string;
  immediate_containment: ContainmentAction[];
  investigation_approach: '5_whys' | 'fishbone' | 'both';
  fishbone_data: FishboneStructure;
  five_whys_data: FiveWhysStep[];
  suspected_root_cause: string;
  contributing_factors: string[];
  missing_evidence: MissingEvidenceItem[];
  capa_recommendations: CAPAItem[];
  investigator_notes: string;
  qp_signoff: QPSignoff;
  raw_input_text?: string;
  source_filename?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PresetScenario {
  id: string;
  name: string;
  description: string;
  product: string;
}
