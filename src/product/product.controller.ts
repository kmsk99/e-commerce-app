import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HttpError4xxDto } from '@root/app.dto';
import { ProductEntity } from './entities/product.entity';

@Controller('products')
@ApiTags('Product Api')
@ApiBadRequestResponse({
  description: 'No required argument',
  type: HttpError4xxDto,
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Product Api',
    description: 'Create Product',
  })
  @ApiCreatedResponse({ description: 'Create Product', type: ProductEntity })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Create Product Api',
    description: 'Create Product',
  })
  findByCategory(@Query('category') seachingCategoryId: number) {
    return this.productService.findByCategory(seachingCategoryId);
  }

  @Get()
  @ApiOperation({
    summary: 'Find All Products Api',
    description: 'Find All Products',
  })
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find Product Api',
    description: 'Find Product',
  })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Product Api',
    description: 'Update Product',
  })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove Product Api',
    description: 'Remove Product',
  })
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
