export class CreateDeviceDto {
  typeId: number;
  userId?: number;
  departmentId?: number;
  status: string;
  serialNumber?: string;
  model?: string;
}
