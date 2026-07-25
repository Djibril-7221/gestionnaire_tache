import { Controller, Get, Post, Body, Patch, Param, Delete , UseGuards } from '@nestjs/common';
import { TachesService } from './taches.service';
import { CreateTachDto } from './dto/create-tach.dto';
import { UpdateTachDto } from './dto/update-tach.dto';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { TacheCreateGuard } from './guard/tache-create.guard';
import { TacheFindAllGuard } from './guard/tache-findAll.guard';
import { TacheUpdateDeleteGuard } from './guard/tache-update-delete.guard';
import { TacheFindOneGuard } from './guard/tache-findOne.guard';

@Controller('taches')
export class TachesController {
  constructor(private readonly tachesService: TachesService) {}


  @UseGuards(TacheCreateGuard)
  @Post()
  create(@Body() createTachDto: CreateTachDto , @CurrentUser() utilisateur: any) {
    return this.tachesService.create(createTachDto , utilisateur );
  }

  @UseGuards(TacheFindAllGuard)
  @Get()
  findAll() {
    return this.tachesService.findAll();
  }

  @UseGuards(TacheFindOneGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tachesService.findOne(+id);
  }
   
  @UseGuards(TacheUpdateDeleteGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTachDto: UpdateTachDto) {
    return this.tachesService.update(+id, updateTachDto);
  }

  @UseGuards(TacheUpdateDeleteGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tachesService.remove(+id);
  }
}
