# Changelog v7.1.0 - Migration to Angular 20 with Signals

## 🚀 Major Changes

### Standalone Component
- **BREAKING CHANGE**: Component is now standalone by default
- Removed `FilePondModule` - no longer necessary to import a module
- Component is imported directly instead of through a module

### Signals API
- **BREAKING CHANGE**: Complete migration to Angular Signals
- `@Input()` decorators are now `input<T>()` signals
- `@Output()` decorators are now `output<T>()` signals
- Automatic reactivity without the need for `ngOnChanges`

### Modern Dependency Injection
- Use of `inject()` instead of constructor injection
- Cleaner and more modular code

### Performance
- Better change detection with signals
- Optimized reactivity with `effect()`
- Smaller bundle size without modules

## 📋 Detailed Change List

### Component API

#### Inputs (now signals)
```typescript
// Before (v6.x)
@Input() options: FilePondOptions;
@Input() files: FilePondOptions["files"];

// Now (v7.x)
options = input<FilePondOptions | any>({});
files = input<FilePondOptions["files"]>();
```

#### Outputs (now signals)
```typescript
// Before (v6.x)
@Output() oninit = new EventEmitter<any>();
@Output() onaddfile = new EventEmitter<any>();
// ... etc

// Now (v7.x)
oninit = output<any>();
onaddfile = output<any>();
// ... etc
```

#### Lifecycle Hooks
- ✅ Kept: `ngAfterViewInit`
- ✅ Kept: `ngOnDestroy`
- ❌ Removed: `ngOnChanges` (replaced by `effect()`)

### Internal Changes

#### Change Detection
```typescript
// Before (v6.x)
ngOnChanges(changes: SimpleChanges) {
  if (this.pond) {
    this.pond.setOptions({
      ...this.options,
      files: this.files
    });
  }
}

// Now (v7.x)
constructor() {
  effect(() => {
    const currentOptions = this.options();
    const currentFiles = this.files();
    if (this.pond) {
      this.pond.setOptions({
        ...currentOptions,
        files: currentFiles,
      });
    }
  });
}
```

#### Dependency Injection
```typescript
// Before (v6.x)
constructor(root: ElementRef, zone: NgZone) {
  this.root = root;
  this.zone = zone;
}

// Now (v7.x)
private root = inject(ElementRef);
private zone = inject(NgZone);

constructor() {
  // effect() here
}
```

## 🔄 Compatibility

### Supported Versions
- **Angular**: >= 20.x
- **FilePond**: >= 4.19.1 < 5.x
- **TypeScript**: >= 5.4

### Breaking Changes
1. **Module removed**: `FilePondModule` no longer exists
2. **Imports changed**: Import component directly
3. **Signals API**: Inputs/outputs are signals, not decorators
4. **Constructor**: No longer receives parameters (uses `inject()`)

## 📦 Bundle Size

### Tree-shaking Improvements
- Standalone component allows better tree-shaking
- Module removal reduces overhead
- Smaller bundle in applications using standalone components

## 🐛 Fixes
- Better reactive change handling with `effect()`
- Automatic synchronization of options and files
- Prevention of unnecessary updates

## 🎯 Next Steps

To migrate your application, check [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md)
