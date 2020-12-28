import { 
  Component,
  ElementRef,
  SimpleChanges,
  ViewEncapsulation,
  EventEmitter,
  NgZone,
  Input,
  AfterViewInit,
  OnChanges,
  OnDestroy
} from '@angular/core';

import {
  create,
  supported,
  FilePond,
  FilePondOptions
} from 'filepond';

// We test if filepond is supported on the current client
const isSupported: Boolean = supported();

// List of attributes for fallback input
const inputAttributes: Array<string> = [
  'id', 
  'name',
  'class', 
  'multiple', 
  'required', 
  'disabled',
  'capture',
  'accept'
];

// Methods not made available on the component
const filteredComponentMethods: Array<string> = [
  'setOptions',
  'on',
  'off',
  'onOnce',
  'appendTo',
  'insertAfter',
  'insertBefore',
  'isAttachedTo',
  'replaceElement',
  'restoreElement',
  'destroy'
];

const outputs: Array<string> = [
  'oninit', 
  'onwarning', 
  'onerror', 
  'onactivatefile',
  'onaddfilestart', 
  'onaddfileprogress', 
  'onaddfile', 
  'onprocessfilestart', 
  'onprocessfileprogress', 
  'onprocessfileabort', 
  'onprocessfilerevert', 
  'onprocessfile',
  'onprocessfiles',
  'onremovefile',
  'onpreparefile',
  'onupdatefiles'
];

// Component outline
@Component({
  selector: 'file-pond',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './filepond.component.html',
  styleUrls: ['./filepond.component.css'],
  outputs
})
export class FilePondComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input()
  options: FilePondOptions = {};

  @Input()
  files: FilePondOptions['files'];

  private root: ElementRef;
  private zone: NgZone;
  private pond: FilePond;
  private handleEvent: Function = null;

  constructor(root: ElementRef, zone: NgZone) {
    this.root = root;
    this.zone = zone;

    outputs.forEach(output => {
      this[output] = new EventEmitter<any>();
    });
  }

  ngAfterViewInit() {

    const input = this.root.nativeElement.querySelector('input');

    // transfer relevant attributes to input, this so we still have an input with the correct attributes should file pond not load
    const attributes = this.root.nativeElement.attributes;
    inputAttributes.forEach(name => {
      const value = attributes[name] ? attributes[name].value : this.options[name];
      if (!value) {
        return;
      }
      input.setAttribute(name, value);
    });

    // no sufficient features supported in this browser
    if (!isSupported) {
      return;
    }

    // map FilePond events to Angular $emitters
    this.handleEvent = (e) => {
      this[`on${e.type.split(':')[1]}`].emit({...e.detail});
    };
    outputs.forEach(event => {
      this.root.nativeElement.addEventListener(`FilePond:${ event.substr(2) }`, this.handleEvent);
    });
  
    // will block angular from listening to events inside the pond
    this.zone.runOutsideAngular(() => {
      
      // create instance
      this.pond = create(input, {
          // our options
          ...this.options, 

          // our initial files
          files: this.files
        }
      );

    });

    // Copy instance method references to component instance
    Object.keys(this.pond)
      
      // remove unwanted methods
      .filter(key => filteredComponentMethods.indexOf(key) === -1)
      
      // set method references from the component instance to the pond instance
      .forEach(key => {
        this[key] = this.pond[key];
      });

  }

  ngOnChanges(changes: SimpleChanges) {

    // no need to handle first change
    if (changes.firstChange) {
      return;
    };

    // no filepond instance available
    if (!this.pond) {
      return;
    }

    // use new options object as base ( or if not available, use current options )
    const options = changes.options ? changes.options.currentValue : this.options;

    // see if file list has changed
    if (changes.files && JSON.stringify(changes.files.previousValue) !== JSON.stringify(changes.files.currentValue)) {
     
      // file list has changed
      options.files = changes.files.currentValue;
    }
    
    // set new options
    this.pond.setOptions(options);
  }

  ngOnDestroy() {
    if (!this.pond) {
        return;
    }

    outputs.forEach(event => {
      this.root.nativeElement.removeEventListener(`FilePond:${ event.substr(2) }`, this.handleEvent);
    });

    this.pond.destroy();
  }

}
