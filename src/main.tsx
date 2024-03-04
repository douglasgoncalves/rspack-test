import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Resource } from '@opentelemetry/resources';
import './index.css';

import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import {
  BatchSpanProcessor,
  TracerConfig,
  WebTracerProvider,
} from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const collectorOptions = {
  url: 'https://otlp.nr-data.net:443',
  headers: {
    'api-key': 'XXX'
  }
};

const providerConfig: TracerConfig = {
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'my-react-app',
  }),
};

const provider = new WebTracerProvider(providerConfig);

provider.addSpanProcessor(
  new BatchSpanProcessor(new OTLPTraceExporter(collectorOptions)),
);

provider.register({
  contextManager: new ZoneContextManager(),
});

registerInstrumentations({
  instrumentations: [getWebAutoInstrumentations()],
});


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
