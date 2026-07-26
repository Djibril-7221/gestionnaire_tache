import { Controller, Get, Post, Body, Patch, Param, Delete , UseGuards} from '@nestjs/common';
import { CommentairesService } from './commentaires.service';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { UpdateCommentaireDto } from './dto/update-commentaire.dto';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { CommentaireCreateGuard } from './guard/commentaire-create.guard';
import { CommentaireUpdateDeleteGuard } from './guard/commentaire-update-delete.guard';

@Controller('commentaires')
export class CommentairesController {
  constructor(private readonly commentairesService: CommentairesService) {}
  
 @UseGuards(CommentaireCreateGuard)
  @Post()
  create(@Body() createCommentaireDto: CreateCommentaireDto ,  @CurrentUser() utilisateur: any) {
    return this.commentairesService.create(createCommentaireDto , utilisateur);
  }

  @UseGuards(CommentaireUpdateDeleteGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentaireDto: UpdateCommentaireDto) {
    return this.commentairesService.update(+id, updateCommentaireDto);
  }
  
  @UseGuards(CommentaireUpdateDeleteGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentairesService.remove(+id);
  }
}
