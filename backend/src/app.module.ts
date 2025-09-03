import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DepartmentsModule } from "./departments/departments.module";
import { EmployeesModule } from "./employees/employees.module";
import { DeviceTypesModule } from "./device-types/device-types.module";
import { DevicesModule } from "./devices/devices.module";
import { PrintersModule } from "./printers/printers.module";
import { CartridgesModule } from "./cartridges/cartridges.module";
import { CartridgeUsageModule } from "./cartridge-usage/cartridge-usage.module";
import { ConsumablesModule } from "./consumables/consumables.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { AuditLogsModule } from "./audit-logs/audit-logs.module";
import { ReportsModule } from "./reports/reports.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432", 10),
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      // password: process.env.DB_PASSWORD || "QwertyWeb123_321",
      database: process.env.DB_NAME || "it_inventory",
      autoLoadEntities: true,
      synchronize: true,
    }),
    DepartmentsModule,
    EmployeesModule,
    DeviceTypesModule,
    DevicesModule,
    PrintersModule,
    CartridgesModule,
    CartridgeUsageModule,
    ConsumablesModule,
    NotificationsModule,
    AuditLogsModule,
    ReportsModule,
  ],
})
export class AppModule {}
