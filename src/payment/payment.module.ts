import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { UserModule } from '@root/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentRepository } from './payment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentRepository]), UserModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
