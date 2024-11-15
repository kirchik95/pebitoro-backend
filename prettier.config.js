const config = {
  endOfLine: 'lf',
  useTabs: false,
  tabWidth: 2,
  printWidth: 120,
  semi: true,
  singleQuote: true,
  bracketSpacing: true,
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrderSeparation: true,
  importOrder: [
    '^fastify$',
    '^@fastify$',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@db/(.*)$',
    '',
    '^@plugins/(.*)$',
    '',
    '^@routes/(.*)$',
    '',
    '^@modules/(.*)$',
    '',
    '^[.]',
  ],
};

export default config;
