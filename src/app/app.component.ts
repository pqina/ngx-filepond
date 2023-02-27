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
    // fake server to simulate loading a 'local' server file and processing a file
    server: {
      process: (fieldName, file, metadata, load) => {
        // simulates uploading a file
        setTimeout(() => {
          load(Date.now().toString);
        }, 1500);
      },
      load: (source, load) => {
        // simulates loading a file from the server
        fetch(source)
          .then((res) => res.blob())
          .then(load);
      },
    },
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
