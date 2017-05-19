import { Injectable, Inject, forwardRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import * as pica from 'bergben-pica';

import { ImgExifService } from './img-exif.service';

export interface resizeCanvasOptions {
    quality?: number;
    alpha?: boolean;
    unsharpAmount?: number;
    unsharpRadius?: number;
    unsharpThreshold?: number;
}

export interface resizeBufferOptions {
    src: Uint8Array;
    width: number;
    height: number;
    toWidth: number;
    toHeight: number;
    quality?: number;
    alpha?: boolean;
    unsharpAmount?: number;
    unsharpRadius?: number;
    unsharpThreshold?: number;
}

@Injectable()
export class Ng2PicaService {
    constructor(@Inject(forwardRef(() => ImgExifService)) private imageExifService:ImgExifService){
    }
    public resize(files: File[], width: number, height: number): Observable<any> {
        let resizedFile: Subject<File> = new Subject<File>();
        files.forEach((file) => {
            this.resizeFile(file, width, height).then((returnedFile) => {
                resizedFile.next(returnedFile);
            }).catch((error) => {
                resizedFile.error(error);
            });
        });
        return resizedFile.asObservable();
    }
    public resizeCanvas(from: HTMLCanvasElement, to: HTMLCanvasElement, options: resizeCanvasOptions): Promise<HTMLCanvasElement> {
        let result: Promise<HTMLCanvasElement> = new Promise((resolve, reject) => {
            pica.resizeCanvas(from, to, options, (error) => {
                //resize complete
                if (error) {
                    reject(error);
                }
                else {
                    //success
                    resolve(to);
                }
            });
        });
        return result;
    }
    public resizeBuffer(options: resizeBufferOptions): Promise<Uint8Array> {
        let result: Promise<Uint8Array> = new Promise((resolve, reject) => {
            pica.resizeBuffer(options, (error, output) => {
                //resize complete
                if (error) {
                    reject(error);
                }
                else {
                    //success
                    resolve(output);
                }
            });
        });
        return result;
    }

    private resizeFile(file: File, width: number, height: number): Promise<File> {
        let result: Promise<File> = new Promise((resolve, reject) => {
            let fromCanvas: HTMLCanvasElement = document.createElement('canvas');
            let ctx = fromCanvas.getContext('2d');
            let img = new Image();
            img.onload = () => {
                this.imageExifService.getOrientedImage(img).then(orientedImg=>{
                    window.URL.revokeObjectURL(img.src);
                    fromCanvas.width = orientedImg.width;
                    fromCanvas.height = orientedImg.height;
                    ctx.drawImage(orientedImg, 0, 0);
                    let imageData = ctx.getImageData(0, 0, orientedImg.width, orientedImg.height);
                    let useAlpha = true;
                    if (file.type === "image/jpeg" || (file.type === "image/png" && !this.isImgUsingAlpha(imageData))) {
                        //image without alpha
                        useAlpha = false;
                        ctx = fromCanvas.getContext('2d', { 'alpha': false });
                        ctx.drawImage(orientedImg, 0, 0);
                    }
                    let toCanvas: HTMLCanvasElement = document.createElement('canvas');
                    toCanvas.width = width;
                    toCanvas.height = height;
                    this.resizeCanvas(fromCanvas, toCanvas, { 'alpha': useAlpha })
                        .then((resizedCanvas: HTMLCanvasElement) => {
                            resizedCanvas.toBlob((blob) => {
                                let newFile = new File([blob], file.name, { type: file.type, lastModified: new Date().getTime() });
                                resolve(newFile);
                            }, useAlpha ? "image/png" : "image/jpeg");
                        })
                        .catch((error) => {
                            reject(error);
                        });
                });
            }
            img.src = window.URL.createObjectURL(file);
        });
        return result;
    }
    private isImgUsingAlpha(imageData): boolean {
        for (var i = 0; i < imageData.data.length; i += 4) {
            if (imageData.data[i + 3] !== 255) {
                return true;
            }
        }
        return false;
    }
}