import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../app/app.module';
import { writeFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';

async function generateSwaggerSpec() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Maintainerr API')
    .setDescription('Documentation for Maintainerr API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const yamlDocument = yaml.dump(document);

  // Write the YAML document to the `openapi` directory
  const outputPath = join(__dirname, './openapi_spec.yaml');
  writeFileSync(outputPath, yamlDocument, { encoding: 'utf8' });

  console.log(`Swagger spec generated at: ${outputPath}`);
  await app.close();
}

generateSwaggerSpec();
