import { HttpModule } from '@nestjs/axios'; import { Module } from '@nestjs/common'; import { ConfigModule, ConfigService } from '@nestjs/config'; import { MongooseModule } from '@nestjs/mongoose';
import { BillingController, HealthController } from './billing.controller'; import { BillingService } from './billing.service'; import { Invoice, InvoiceSchema } from './billing.schema';

@Module({ imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), MongooseModule.forRootAsync({ imports: [ConfigModule], inject: [ConfigService], useFactory: (config: ConfigService) => ({ uri: config.get<string>('MONGODB_URI') }) }), HttpModule, MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }])], controllers: [BillingController, HealthController], providers: [BillingService] })
export class BillingModule {}
