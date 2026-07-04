export interface Note {
  id: string;
  title: string;
  content: string;
  status: "pending" | "completed";
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReminderRun {
  id: string;
  job_key: string;
  notes_count: number;
  completed_count: number;
  error: string | null;
  started_at: string;
  finished_at: string | null;
}

export interface ProcessRun {
  id: string;
  started_at: string;
  status: "in-progress" | "completed" | "failed";
  notes_count?: number;
  error?: string | null;
}

export interface ProjectResult {
  id: string;
  started_at: string;
  finished_at: string | null;
  notes_collected: number;
  status: "completed" | "failed";
  error: string | null;
}
