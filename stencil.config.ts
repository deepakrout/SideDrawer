import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'DkComponents',
  taskQueue: 'async',
  plugins: [
    sass({
      injectGlobalPaths: ["src/global/variables.scss"]
    })
  ],
  outputTargets: [
    {
      type: 'dist', 
      esmLoaderPath: '../loader'
    },
    // {
    //   type: 'docs-readme'
    // },
    // {
    //   type: 'www',
    //   serviceWorker: null // disable service workers
    // }
  ]
};
