import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(product: Product): Promise<Product> {
    const newProduct = await this.productRepository.create(product);
    await this.productRepository.save(newProduct);
    return await this.productRepository.save(product);
  }

  async update(id: number, productData: Product): Promise<Product> {
    const product = await this.findOne(id);
    this.productRepository.merge(product, productData);
    return await this.productRepository.save(product);
  }

  async delete(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Product not found');
    }
  }
}
