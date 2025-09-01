export class CreateConsumableDto {
  type: string;
  quantity: number;
  status: string;
  departmentId?: number;
  userId?: number;
}
