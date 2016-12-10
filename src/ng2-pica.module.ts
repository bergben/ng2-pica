import { NgModule, ModuleWithProviders } from '@angular/core';
import { Ng2PicaService } from './ng2-pica.service';

@NgModule({
  providers: [Ng2PicaService]
})
export class Ng2PicaModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: Ng2PicaModule,
      providers: [
        {provide: Ng2PicaService, useClass: Ng2PicaService}
      ]
    };

  }
}