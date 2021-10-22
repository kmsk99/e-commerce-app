import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@root/app.controller';
import { UsersModule } from '@root/users/users.module';
import { CartModule } from '@root/cart/cart.module';
import { ProductModule } from '@root/product/product.module';
import { CartItemModule } from '@root/cart-item/cart-item.module';
import { OrderModule } from '@root/order/order.module';
import { OrderItemsModule } from '@root/order-item/order-item.module';
import { PaymentModule } from '@root/payment/payment.module';
import { AuthModule } from '@root/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities:
        process.env.NODE_ENV === 'test'
          ? [__dirname + '/../**/*.entity.ts']
          : ['dist/**/**.entity{.ts,.js}'],
      logging: true,
      synchronize: true,
    }),
    UsersModule,
    CartModule,
    ProductModule,
    CartItemModule,
    OrderModule,
    OrderItemsModule,
    PaymentModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
