export class CreateAuditLogDto {
  action: string;
  entity: string;
  userId?: number;
}
