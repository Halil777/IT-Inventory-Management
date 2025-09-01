export class CreateEmployeeDto {
  name: string;
  surname: string;
  role: string;
  departmentId: number;
  phone?: string;
  email: string;
}
