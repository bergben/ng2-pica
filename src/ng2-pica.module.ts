import { NgModule } from '@angular/core';
import { Ng2PicaService } from './ng2-pica.service';
import { ImgExifService } from './img-exif.service';

@NgModule({
    providers: [
        {provide: Ng2PicaService, useClass: Ng2PicaService},
        {provide: ImgExifService, useClass: ImgExifService}
    ]
})
export class Ng2PicaModule {}