import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilePondComponent } from './filepond.component';

export { registerPlugin } from 'filepond';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FilePondComponent],
  exports: [
    FilePondComponent
  ]
})
export class FilePondModule { }