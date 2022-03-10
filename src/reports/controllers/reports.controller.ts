import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { CreateReportDto } from '../dtos/create-report.dto';
import { ReportsService } from '../services/reports.service';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from '../../users/entities/user.entity';
import { CurrentUser } from '../../users/decorators/current-user.decorator';
import { ReportDto } from '../dtos/report.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { ApproveReportDto } from '../dtos/approve-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  create(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(id, body.approved)
  }
}
