import { devConfig } from './config.dev';
let envConfig, kafkaConfig;

switch (process.env.NODE_ENV) {
  case 'DEV': {
    envConfig = devConfig;
    break;
  }
  default: {
    envConfig = devConfig;
  }
}

const finalConfig = { ...envConfig };

export default () => finalConfig;
