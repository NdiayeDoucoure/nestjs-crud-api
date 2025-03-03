import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { ProductDto } from './product.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Return all products.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productsService.findOne(+id);
  }

  @Post()
  create(@Body() productDto: ProductDto): Promise<Product> {
    return this.productsService.create(productDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() productDto: ProductDto,
  ): Promise<Product> {
    return this.productsService.update(+id, productDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.productsService.delete(+id);
  }
}
