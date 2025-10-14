export type ReportItem = Record<string, unknown>;

export interface ReportsData {
  devicesByDepartment: ReportItem[];
  printersStats: ReportItem[];
  consumablesStats: ReportItem[];
  devicesByEmployee: ReportItem[];
}

