export class CreateEmployeeDto {
  name: string;
  email: string;
  phone?: string;
  civilNumber?: string;
  departmentId?: number;
  role?: string;
  status: string;
}
