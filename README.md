# Angular FilePond

Angular FilePond is a handy adapter component for [FilePond](https://github.com/pqina/filepond), a JavaScript library that can upload anything you throw at it, optimizes images for faster uploads, and offers a great, accessible, silky smooth user experience.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/pqina/ngx-filepond/blob/master/LICENSE)
[![npm version](https://badge.fury.io/js/ngx-filepond.svg)](https://www.npmjs.com/package/ngx-filepond)
![npm](https://img.shields.io/npm/dt/ngx-filepond)
![npm peer dependency version](https://img.shields.io/npm/dependency-version/ngx-filepond/peer/@angular/core)

---

[<img src="https://github.com/pqina/filepond-github-assets/blob/master/header.svg" alt="FilePond"/>](https://www.buymeacoffee.com/rikschennink/)

[Buy me a Coffee](https://www.buymeacoffee.com/rikschennink/) / [Use FilePond with Pintura](https://pqina.nl/pintura/?ref=github-filepond) / [Dev updates on Twitter](https://twitter.com/rikschennink/)

---

### Core Features

- Accepts **directories**, **files**, blobs, local URLs, **remote URLs** and Data URIs.
- **Drop files**, select on filesystem, **copy and paste files**, or add files using the API.
- **Async uploading** with AJAX, or encode files as base64 data and send along form post.
- **Accessible**, tested with AT software like VoiceOver and JAWS, **navigable by Keyboard**.
- **Image optimization**, automatic image resizing, **cropping**, and **fixes EXIF orientation**.
- **Responsive**, automatically scales to available space, is functional on both **mobile and desktop devices**.

[Learn more about FilePond](https://pqina.nl/filepond/)

<img src="https://github.com/pqina/filepond-github-assets/blob/master/filepond-animation-01.gif?raw=true" width="370" alt=""/>

---

### Also need Image Editing?

**Pintura the modern JavaScript Image Editor** is what you're looking for. Pintura supports setting **crop aspect ratios**, **resizing**, **rotating**, **cropping**, and **flipping** images. Above all, it integrates beautifully with FilePond.

[Learn more about Pintura](https://pqina.nl/pintura/?ref=github-angular-filepond)

<img src="https://github.com/pqina/filepond-github-assets/blob/master/filepond_pintura.gif?raw=true" width="600" alt=""/>

## Installation

Install FilePond component from npm.

```bash
npm install filepond ngx-filepond --save
```

Import `FilePondModule` and if needed register any plugins. Please note that plugins need to be [installed from npm](https://pqina.nl/filepond/docs/patterns/plugins/introduction/#installing-plugins) separately.

Add FilePond styles path `./node_modules/filepond/dist/filepond.min.css` to the `build.options.styles` property in `angular.json`

[Setting up FilePond with Angular 13](https://github.com/pqina/ngx-filepond/issues/70#issuecomment-1273741734)

```ts
// app.module.ts
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";

// import filepond module
import { FilePondModule, registerPlugin } from "ngx-filepond";

// import and register filepond file type validation plugin
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

registerPlugin(FilePondPluginFileValidateType);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FilePondModule, // add filepond module here
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

```html
<!-- app.component.html -->
<file-pond
  #myPond
  [options]="pondOptions"
  [files]="pondFiles"
  (oninit)="pondHandleInit()"
  (onaddfile)="pondHandleAddFile($event)"
  (onactivatefile)="pondHandleActivateFile($event)"
>
</file-pond>
```

```ts
// app.component.ts
import { Component, ViewChild } from "@angular/core";
import { FilePondComponent } from "ngx-filepond";
import { FilePondOptions } from "filepond";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  @ViewChild("myPond") myPond: FilePondComponent;

  pondOptions: FilePondOptions = {
    allowMultiple: true,
    labelIdle: "Drop files here...",
  };

  pondFiles: FilePondOptions["files"] = [
    {
      source: "assets/photo.jpeg",
      options: {
        type: "local",
      },
    },
  ];

  pondHandleInit() {
    console.log("FilePond has initialised", this.myPond);
  }

  pondHandleAddFile(event: any) {
    console.log("A file was added", event);
  }

  pondHandleActivateFile(event: any) {
    console.log("A file was activated", event);
  }
}
```

## How to fix import errors

If you get a `"types/index" has no default export` error, you can either rewrite the import:

```js
import * as FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
```

Or add these 2 lines to your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

[Read the docs for more information](https://pqina.nl/filepond/docs/patterns/frameworks/angular/)
