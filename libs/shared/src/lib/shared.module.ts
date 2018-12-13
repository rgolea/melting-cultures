import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPipe } from './pipes';

@NgModule({
  imports: [CommonModule],
  declarations: [SearchPipe],
  exports: [SearchPipe]
})
export class SharedModule {}
