import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({
    title: 'The title of a product',
    required: true,
    type: 'string',
  })
  readonly title: string;
  @ApiProperty({
    title: 'The description of a product',
    required: false,
    type: 'string',
  })
  readonly description: string;
}
