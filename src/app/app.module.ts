import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";

import {
  FilePondModule,
  registerPlugin,
} from "./modules/filepond/filepond.module";

import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FilePondModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
