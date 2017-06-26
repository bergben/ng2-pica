[![Join the chat at https://gitter.im/bergben/bergben](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/bergben/bergben?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# ng2-pica
Angular 2 and beyond wrapper for <a href="https://github.com/nodeca/pica">pica</a> to resize images. 

Uses a fork from <a href="https://github.com/nodeca/pica">pica</a> (<a href="https://github.com/bergben/pica">bergben/pica</a>) which has WebGL and node.js support removed to be compatible with TS and Angular 2.

## Install
```bash
$ npm install ng2-pica --save
```

### Import the module
```TypeScript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2PicaModule } from 'ng2-pica'; // <-- import the module
import { MyComponent } from './my.component';

@NgModule({
    imports: [BrowserModule,
              Ng2PicaModule // <-- include it in your app module
             ],
    declarations: [MyComponent],  
    bootstrap: [MyComponent]
})
export class MyAppModule {}
```
## Usage
```TypeScript
import { Ng2PicaService } from 'ng2-pica';

@Injectable()
export class ImgMaxPXSizeService {
    constructor(private ng2PicaService: Ng2PicaService) {
      this.ng2PicaService.resize([someFile], newWidth, newHeight).subscribe((result)=>{
            //all good, result is a file
            console.info(result);
      }, error =>{
            //something went wrong 
            console.error(error);
      });
    }
}
```

## Methods

### `.resize(files: File[], width: number, height: number): Observable<any>`
This method should fit most use cases. Expects an array of files, a width and height to which the images should be resized. Returns a file, if something goes wrong, returns an error object instead forwarded directly from pica.
The Observable receives a next on every file that has been resized.

### `resizeCanvas(from: HTMLCanvasElement, to: HTMLCanvasElement, options: resizeCanvasOptions): Promise<HTMLCanvasElement>`
### `resizeBuffer(options: resizeBufferOptions): Promise<Uint8Array>`
Please check out the <a href="https://github.com/nodeca/pica">pica</a> readme for more information on those methods.

## To-do
 - Provide a demo
