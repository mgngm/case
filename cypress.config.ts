import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import webpack from '@cypress/webpack-preprocessor';
import { defineConfig } from 'cypress';

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    'file:preprocessor',
    webpack({
      webpackOptions: {
        resolve: {
          extensions: ['.ts', '.js'],
        },
        module: {
          rules: [
            {
              test: /\.ts$/,
              exclude: [/node_modules/],
              use: [
                {
                  loader: 'ts-loader',
                },
              ],
            },
            {
              test: /\.feature$/,
              use: [
                {
                  loader: '@badeball/cypress-cucumber-preprocessor/webpack',
                  options: config,
                },
              ],
            },
          ],
        },
      },
    })
  );

  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

export default defineConfig({
  e2e: {
    specPattern: 'cypress/**/*.feature',
    //baseUrl: `http://localhost:${process.env.PORT ?? '3000'}`,
    baseUrl: process.env.CYPRESS_BASE_URL ? process.env.CYPRESS_BASE_URL : 'https://portal.dev.actual-experience.com',
    defaultCommandTimeout: 10000,
    setupNodeEvents,
    experimentalSessionAndOrigin: true,
  },
});
