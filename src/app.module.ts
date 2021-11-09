import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@root/app.controller';
import { UserModule } from '@root/user/user.module';
import { CartModule } from '@root/cart/cart.module';
import { ProductModule } from '@root/product/product.module';
import { CartItemModule } from '@root/cart-item/cart-item.module';
import { OrderModule } from '@root/order/order.module';
import { OrderItemModule } from '@root/order-item/order-item.module';
import { PaymentModule } from '@root/payment/payment.module';
import { AuthModule } from '@root/auth/auth.module';
import { CategoryModule } from '@root/category/category.module';
import { ConfigModule } from '@nestjs/config';
import { CheckoutService } from './checkout/checkout.service';
import { CheckoutModule } from './checkout/checkout.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    TypeOrmModule.forRoot({
      url: process.env.DATABASE_URL,
      type: 'postgres',
      // host: process.env.DB_HOST,
      // port: parseInt(process.env.DB_PORT),
      // username: process.env.DB_USERNAME,
      // password: process.env.DB_PASSWORD,
      // database: process.env.DB_NAME,
      entities:
        process.env.NODE_ENV === 'test'
          ? [__dirname + '/../**/*.entity.{js,ts}']
          : [__dirname + '/**/*.entity.{js,ts}'],
      logging: true,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    CartModule,
    ProductModule,
    CartItemModule,
    OrderModule,
    OrderItemModule,
    PaymentModule,
    AuthModule,
    CategoryModule,
    CheckoutModule,
  ],
  controllers: [AppController],
  providers: [CheckoutService],
})
export class AppModule {}
