export interface RegistrationRequest {
  fullName: string;
  employeeCode: string;
  department: string;
  phoneNumber: string;
}

export interface Registration extends RegistrationRequest {
  id: string;
  createdAt: string;
}

export interface RegistrationResponse {
  id: string;
  fullName: string;
  employeeCode: string;
  department: string;
  phoneNumber: string;
  created: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CloudflareEnv {
  DB: D1Database;
}

// Type for D1 Database result
export interface D1Database {
  prepare(sql: string): D1PreparedStatement;
  exec(sql: string): Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first(columnName?: string): Promise<Record<string, any> | undefined>;
  all(): Promise<D1Result>;
  run(): Promise<D1ExecResult>;
}

export interface D1Result {
  success: boolean;
  results?: Record<string, any>[];
  meta?: {
    duration: number;
  };
}

export interface D1ExecResult {
  success: boolean;
  results?: any[];
}
