import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { CreateReportDto, ReportDto, ApproveReportDto } from '../dtos';
import { AuthGuard, AdminGuard } from '../../guards';
import { ReportsService } from '../services/reports.service';
import { User } from '../../users/entities/user.entity';
import { CurrentUser } from '../../users/decorators/current-user.decorator';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { GetEstimateDto } from '../dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query)
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  create(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(id, body.approved)
  }
}
