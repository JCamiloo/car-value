import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../entities/report.entity';
import { CreateReportDto } from '../dtos/create-report.dto';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repository: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repository.create(reportDto);
    report.user = user;

    return this.repository.save(report);
  }
}
