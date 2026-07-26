import { Controller, Get, Post, Body, Patch, Param, Delete , UseGuards } from '@nestjs/common';
import { TachesService } from './taches.service';
import { CreateTachDto } from './dto/create-tach.dto';
import { UpdateTachDto } from './dto/update-tach.dto';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { TacheCreateGuard } from './guard/tache-create.guard';
import { TacheFindAllGuard } from './guard/tache-findAll.guard';
import { TacheUpdateDeleteGuard } from './guard/tache-update-delete.guard';
import { TacheFindOneGuard } from './guard/tache-findOne.guard';
import { TacheMAnagerCollaborateurGuard } from './guard/tache-manager-collaborateur.guard';
import { ParseIntPipe } from '@nestjs/common';

@Controller('taches')
export class TachesController {
  constructor(private readonly tachesService: TachesService) {}

  @UseGuards(TacheCreateGuard)
  @Post('create/:id')
  create(@Param('id', ParseIntPipe) destinataire_id: number , @Body() createTachDto: CreateTachDto , @CurrentUser() utilisateur: any) {
    return this.tachesService.create(createTachDto , utilisateur  , destinataire_id);
  }

  @UseGuards(TacheFindAllGuard)
  @Get()
  findAll() {
    return this.tachesService.findAll();
  }

  @UseGuards(TacheMAnagerCollaborateurGuard)
  @Get('mes-taches')
  findAllForManagerOrCollaborateur(@CurrentUser() utilisateur: { id: number; role: string }) {
    const isManager = utilisateur.role === 'MANAGER';
    return this.tachesService.findAllForManagerOrCollaborateur(utilisateur.id, isManager);
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