import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Req() req) {
    return this.usersService.update(parseInt(id), dto, req.user);
  }
}
