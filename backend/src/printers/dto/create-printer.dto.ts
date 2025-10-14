export class CreatePrinterDto {
  name: string;
  model: string;
  description?: string;
  departmentId?: number | null;
  userId?: number | null;
}
