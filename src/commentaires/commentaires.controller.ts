import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentairesService } from './commentaires.service';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { UpdateCommentaireDto } from './dto/update-commentaire.dto';

@Controller('commentaires')
export class CommentairesController {
  constructor(private readonly commentairesService: CommentairesService) {}

  @Post()
  create(@Body() createCommentaireDto: CreateCommentaireDto) {
    return this.commentairesService.create(createCommentaireDto);
  }

  @Get()
  findAll() {
    return this.commentairesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentairesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentaireDto: UpdateCommentaireDto) {
    return this.commentairesService.update(+id, updateCommentaireDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentairesService.remove(+id);
  }
}
