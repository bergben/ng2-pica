export default {
    entry: 'dist/index.js',
    dest: 'dist/bundles/ng2-pica.umd.js',
    sourceMap: false,
    format: 'umd',
    moduleName: 'ng2-pica',
    globals: {
        '@angular/core': 'ng.core',
        'rxjs': 'Rx'
    }
}