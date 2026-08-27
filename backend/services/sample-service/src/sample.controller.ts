import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { SampleService } from './sample.service';

@Controller('sample')
export class SampleController {
  constructor(private readonly service: SampleService) {}
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Post() create(@Body() payload: Record<string, unknown>) { return this.service.create(payload); }
  @Patch(':id') update(@Param('id') id: string, @Body() payload: Record<string, unknown>) { return this.service.update(id, payload); }
  @Delete(':id') @HttpCode(200) remove(@Param('id') id: string) { return this.service.remove(id); }
}
