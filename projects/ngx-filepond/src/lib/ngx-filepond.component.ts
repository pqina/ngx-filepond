import {
  Component,
  ElementRef,
  ViewEncapsulation,
  NgZone,
  AfterViewInit,
  OnDestroy,
  inject,
  input,
  output,
  effect,
} from "@angular/core";

import { create, supported, FilePond, FilePondOptions } from "filepond";

// We test if filepond is supported on the current client
const isSupported: Boolean = supported();

// List of attributes for fallback input
const inputAttributes: Array<string> = [
  "id",
  "name",
  "class",
  "multiple",
  "required",
  "disabled",
  "capture",
  "accept",
];

// Methods not made available on the component
const filteredComponentMethods: Array<string> = [
  "setOptions",
  "on",
  "off",
  "onOnce",
  "appendTo",
  "insertAfter",
  "insertBefore",
  "isAttachedTo",
  "replaceElement",
  "restoreElement",
  "destroy",
];

const outputs: Array<string> = [
  "oninit",
  "onwarning",
  "onerror",
  "oninitfile",
  "onaddfilestart",
  "onaddfileprogress",
  "onaddfile",
  "onprocessfilestart",
  "onprocessfileprogress",
  "onprocessfileabort",
  "onprocessfilerevert",
  "onprocessfile",
  "onprocessfiles",
  "onremovefile",
  "onpreparefile",
  "onupdatefiles",
  "onactivatefile",
  "onreorderfiles",
];

// Component outline
@Component({
    selector: "file-pond",
    encapsulation: ViewEncapsulation.None,
    templateUrl: "./ngx-filepond.component.html",
    styleUrls: ["./ngx-filepond.component.css"],
    standalone: true
})
export class FilePondComponent implements AfterViewInit, OnDestroy {
  // Input signals
  options = input<FilePondOptions | any>({});
  files = input<FilePondOptions["files"]>();

  // Output signals
  oninit = output<any>();
  onwarning = output<any>();
  onerror = output<any>();
  oninitfile = output<any>();
  onactivatefile = output<any>();
  onaddfilestart = output<any>();
  onaddfileprogress = output<any>();
  onaddfile = output<any>();
  onprocessfilestart = output<any>();
  onprocessfileprogress = output<any>();
  onprocessfileabort = output<any>();
  onprocessfilerevert = output<any>();
  onprocessfile = output<any>();
  onprocessfiles = output<any>();
  onremovefile = output<any>();
  onpreparefile = output<any>();
  onupdatefiles = output<any>();
  onreorderfiles = output<any>();

  // Dependencies using inject()
  private root = inject(ElementRef);
  private zone = inject(NgZone);

  private pond: FilePond | null = null;
  private handleEvent: Function | null = null;

  constructor() {
    // Effect to handle changes in options and files
    effect(() => {
      const currentOptions = this.options();
      const currentFiles = this.files();

      // Only update if pond is initialized
      if (this.pond) {
        this.pond.setOptions({
          ...currentOptions,
          files: currentFiles,
        });
      }
    });
  }

  ngAfterViewInit() {
    const input = this.root.nativeElement.querySelector("input");

    // transfer relevant attributes to input, this so we still have an input with the correct attributes should file pond not load
    const attributes = this.root.nativeElement.attributes;
    const currentOptions = this.options();
    inputAttributes.forEach((name) => {
      const value = attributes[name]
        ? attributes[name].value
        : currentOptions[name];
      if (!value) {
        return;
      }
      input.setAttribute(name, value);
    });

    // no sufficient features supported in this browser
    if (!isSupported) {
      return;
    }

    // map FilePond events to Angular output signals
    this.handleEvent = (e: Event) => {
      const key = `on${e.type.split(":")[1]}`;
      // @ts-ignore
      this[key].emit({ ...e.detail });
    };
    outputs.forEach((event) => {
      this.root.nativeElement.addEventListener(
        `FilePond:${event.substring(2)}`,
        this.handleEvent
      );
    });

    // will block angular from listening to events inside the pond
    this.zone.runOutsideAngular(() => {
      // create instance
      this.pond = create(input, {
        // our options
        ...currentOptions,

        // our initial files
        files: this.files(),
      });
    });

    // Copy instance method references to component instance
    this.pond &&
      Object.keys(this.pond)

        // remove unwanted methods
        .filter((key) => filteredComponentMethods.indexOf(key) === -1)

        // set method references from the component instance to the pond instance
        .forEach((key) => {
          // @ts-ignore
          this[key] = this.pond[key];
        });
  }


  ngOnDestroy() {
    if (!this.pond) {
      return;
    }

    outputs.forEach((event) => {
      this.root.nativeElement.removeEventListener(
        `FilePond:${event.substring(2)}`,
        this.handleEvent
      );
    });

    this.pond.destroy();
  }
}
