import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from '../dtos/create-report.dto';
import { ReportsService } from '../services/reports.service';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from '../../users/entities/user.entity';
import { CurrentUser } from '../../users/decorators/current-user.decorator';
import { ReportDto } from '../dtos/report.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  create(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }
}
