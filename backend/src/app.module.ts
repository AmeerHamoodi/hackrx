import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MedicationsModule } from './modules/medications/medications.module';
import { PatientsModule } from './modules/patients/patients.module';
import { PharmacistsModule } from './modules/pharmacists/pharmacists.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        name: 'default',
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        database: configService.get('DB_DATABASE'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        entities: ['dist/**/**/**/*.entity.{ts,js}'],
        migrations: ['dist/database/migrations/*.{ts,js}'],
        migrationsTableName: 'typeorm_migrations',
        synchronize: true,
        // logging: true,
      }),
    }),
    AuthModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('APP_KEY'),
      }),
    }),
    MedicationsModule,
    PatientsModule,
    PharmacistsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
