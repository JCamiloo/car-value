import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../entities/report.entity';
import { CreateReportDto, GetEstimateDto } from '../dtos';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repository: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repository.create(reportDto);
    report.user = user;

    return this.repository.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repository.findOne(id);

    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;

    return this.repository.save(report);
  }

  createEstimate({ make, model, longitude, latitude, year, mileage }: GetEstimateDto) {
    return this.repository.createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('longitude - :longitude BETWEEN -5 AND 5', { longitude })
      .andWhere('latitude - :latitude BETWEEN -5 AND 5', { latitude })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(5)
      .getRawMany();
  }
}
