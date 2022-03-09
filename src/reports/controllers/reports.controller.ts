import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from '../dtos/create-report.dto';
import { ReportsService } from '../services/reports.service';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body: CreateReportDto) {
    return this.reportsService.create(body);
  }
}
