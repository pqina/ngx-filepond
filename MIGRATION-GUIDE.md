# Migration Guide - ngx-filepond v6.x → v7.x

This guide will help you migrate your application from ngx-filepond v6.x (Angular 15-19) to v7.x (Angular 20+ with Signals).

## 📋 Prerequisites

Before starting, make sure you have:
- Angular >= 20.x installed
- Node.js >= 18.x
- Your application running correctly on Angular 20

## 🔄 Migration Steps

### Step 1: Update the Dependency

```bash
npm install ngx-filepond@^7.0.0
# or
yarn add ngx-filepond@^7.0.0
# or
pnpm add ngx-filepond@^7.0.0
```

### Step 2: Update Imports

#### ❌ Before (v6.x)

```typescript
import { NgModule } from '@angular/core';
import { FilePondModule } from 'ngx-filepond';

@NgModule({
  imports: [
    FilePondModule
  ]
})
export class AppModule { }
```

#### ✅ Now (v7.x)

**Option A: Standalone Component**
```typescript
import { Component } from '@angular/core';
import { FilePondComponent } from 'ngx-filepond';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [FilePondComponent],
  template: `
    <file-pond
      [options]="pondOptions"
      [files]="myFiles"
      (oninit)="handleInit($event)"
      (onaddfile)="handleAddFile($event)">
    </file-pond>
  `
})
export class UploadComponent { }
```

**Option B: Traditional Module (Partial Migration)**
```typescript
import { NgModule } from '@angular/core';
import { FilePondComponent } from 'ngx-filepond';

@NgModule({
  imports: [
    FilePondComponent // Import as component, not module
  ]
})
export class AppModule { }
```

### Step 3: Update Component Code

Component usage in templates **does NOT change**, but it's important to understand that it now uses signals internally.

#### Template (no changes)
```html
<file-pond
  [options]="pondOptions"
  [files]="myFiles"
  (oninit)="handleInit($event)"
  (onaddfile)="handleAddFile($event)"
  (onprocessfile)="handleProcessFile($event)">
</file-pond>
```

#### Component Code

```typescript
import { Component, signal } from '@angular/core';
import { FilePondComponent } from 'ngx-filepond';
import { FilePondOptions } from 'filepond';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [FilePondComponent],
  templateUrl: './upload.component.html'
})
export class UploadComponent {
  // You can use signals to manage state
  pondOptions: FilePondOptions = {
    allowMultiple: true,
    labelIdle: 'Drop files here or click to browse'
  };

  myFiles = ['path/to/file.jpg'];

  handleInit(event: any) {
    console.log('FilePond initialized', event);
  }

  handleAddFile(event: any) {
    console.log('File added', event);
  }

  handleProcessFile(event: any) {
    console.log('File processed', event);
  }
}
```

### Step 4: Update Plugins (if using any)

The `registerPlugin` method still works the same way:

```typescript
import { Component } from '@angular/core';
import { FilePondComponent, registerPlugin } from 'ngx-filepond';

// Import FilePond plugins
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// Register plugins
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FilePondComponent]
})
export class AppComponent { }
```

### Step 5: Update Tests

#### ❌ Before (v6.x)
```typescript
import { TestBed } from '@angular/core/testing';
import { FilePondModule } from 'ngx-filepond';

describe('UploadComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadComponent],
      imports: [FilePondModule]
    }).compileComponents();
  });
});
```

#### ✅ Now (v7.x)
```typescript
import { TestBed } from '@angular/core/testing';
import { FilePondComponent } from 'ngx-filepond';

describe('UploadComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadComponent, FilePondComponent]
    }).compileComponents();
  });
});
```

## 🎨 CSS Styles

Styles **do NOT change**. Keep importing FilePond CSS as before:

```typescript
// In angular.json
{
  "styles": [
    "node_modules/filepond/dist/filepond.min.css",
    "node_modules/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css"
  ]
}
```

Or in your component:

```typescript
@Component({
  styleUrls: [
    '../../../node_modules/filepond/dist/filepond.min.css'
  ]
})
```

## 🔍 Common Use Cases

### Update Options Dynamically

```typescript
import { Component, signal } from '@angular/core';
import { FilePondComponent } from 'ngx-filepond';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [FilePondComponent],
  template: `
    <button (click)="toggleMultiple()">Toggle Multiple</button>
    <file-pond [options]="pondOptions()"></file-pond>
  `
})
export class UploadComponent {
  // Use signals for reactivity
  pondOptions = signal({
    allowMultiple: true,
    maxFiles: 5
  });

  toggleMultiple() {
    this.pondOptions.update(options => ({
      ...options,
      allowMultiple: !options.allowMultiple
    }));
  }
}
```

### Manage Files with Signals

```typescript
import { Component, signal } from '@angular/core';
import { FilePondComponent } from 'ngx-filepond';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [FilePondComponent],
  template: `
    <file-pond
      [files]="files()"
      (onupdatefiles)="handleUpdateFiles($event)">
    </file-pond>
    <p>Files: {{ files().length }}</p>
  `
})
export class UploadComponent {
  files = signal<any[]>([]);

  handleUpdateFiles(event: any) {
    this.files.set(event.items.map((item: any) => item.file));
  }
}
```

### Access FilePond API

```typescript
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FilePondComponent } from 'ngx-filepond';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [FilePondComponent],
  template: `
    <file-pond #myPond [options]="pondOptions"></file-pond>
    <button (click)="removeAll()">Remove All</button>
  `
})
export class UploadComponent implements AfterViewInit {
  @ViewChild('myPond') myPond!: FilePondComponent;

  pondOptions = {
    allowMultiple: true
  };

  ngAfterViewInit() {
    // Access FilePond methods
    console.log('FilePond instance:', this.myPond);
  }

  removeAll() {
    // @ts-ignore - FilePond methods available directly
    this.myPond.removeFiles();
  }
}
```

## ⚠️ Common Issues

### Error: "NullInjectorError: No provider for ElementRef"

**Cause**: Trying to instantiate the component manually without injection context.

**Solution**: Make sure the component is used within an Angular template or with `TestBed` in tests.

### Error: "Module not found: FilePondModule"

**Cause**: Trying to import the module that no longer exists.

**Solution**: Import `FilePondComponent` directly instead of `FilePondModule`.

```typescript
// ❌ Wrong
import { FilePondModule } from 'ngx-filepond';

// ✅ Correct
import { FilePondComponent } from 'ngx-filepond';
```

### Changes in options are not reflected

**Cause**: In v7.x, changes are detected automatically through signals.

**Solution**: Make sure to pass a new reference of the options object or use signals:

```typescript
// ✅ Good - New reference
this.pondOptions = { ...this.pondOptions, maxFiles: 10 };

// ✅ Better - With signals
this.pondOptions.update(opts => ({ ...opts, maxFiles: 10 }));
```

## 📊 API Comparison

| Feature | v6.x (Angular 15-19) | v7.x (Angular 20+) |
|---------|----------------------|--------------------|
| Component type | Module-based | Standalone |
| Input properties | `@Input()` | `input<T>()` signals |
| Output events | `@Output()` | `output<T>()` signals |
| Change detection | `ngOnChanges` | `effect()` automatic |
| Dependency injection | Constructor | `inject()` |
| Import | `FilePondModule` | `FilePondComponent` |
| Bundle size | Larger | Smaller |
| Tree-shaking | Limited | Optimized |

## 🎯 Migration Checklist

- [ ] Update to Angular 20+
- [ ] Install ngx-filepond v7.x
- [ ] Remove `FilePondModule` imports
- [ ] Import `FilePondComponent` directly
- [ ] Update tests (change `declarations` to `imports`)
- [ ] Verify plugins still work
- [ ] Test file upload and processing
- [ ] Validate events and callbacks
- [ ] Run tests
- [ ] Verify production build

## 🚀 Migration Benefits

1. **Better Performance**: Signals optimize change detection
2. **Smaller Bundle**: Standalone components improve tree-shaking
3. **Modern Code**: Aligned with latest Angular practices
4. **Better DX**: More intuitive and reactive API
5. **Future-proof**: Ready for future Angular versions

## 💬 Support

If you encounter issues during migration:
- Review this complete guide
- Check [CHANGELOG-V7.md](./CHANGELOG-V7.md)
- Report issues on GitHub

Happy migration! 🎉
