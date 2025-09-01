export class CreateCartridgeUsageDto {
  cartridgeId: number;
  printerId: number;
  userId?: number;
  count: number;
}
