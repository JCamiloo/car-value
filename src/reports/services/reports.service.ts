import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../entities/report.entity';
import { CreateReportDto } from '../dtos/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repository: Repository<Report>) {}

  create(reportDto: CreateReportDto) {
    const report = this.repository.create(reportDto);

    return this.repository.save(report);
  }
}
