import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpError4xxDto } from '@root/app.dto';

@Controller('payment')
@ApiTags('Payment Api')
@ApiBadRequestResponse({
  description: 'No required argument',
  type: HttpError4xxDto,
})
@ApiUnauthorizedResponse({
  description: 'Authentication failure',
  type: HttpError4xxDto,
})
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create Payment Api',
    description: 'Create Payment',
  })
  create(@Request() req, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(req.user.id, createPaymentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Find Payment Api',
    description: 'Find Payment',
  })
  findOne(@Request() req) {
    return this.paymentService.findOne(req.user.id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update Payment Api',
    description: 'Update Payment',
  })
  update(@Request() req, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(req.user.id, updatePaymentDto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Remove Payment Api',
    description: 'Remove Payment',
  })
  remove(@Request() req) {
    return this.paymentService.remove(req.user.id);
  }
}
