import { NestFactory } from '@nestjs/core';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { GatewayModule, serviceRoutes } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  for (const route of serviceRoutes) {
    app.use(
      `/api/${route.prefix}`,
      createProxyMiddleware({
        target: process.env[route.env] ?? route.defaultUrl,
        changeOrigin: true,
        pathRewrite: (path) => `/${route.prefix}${path}`,
      }),
    );
  }
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
