const lintStagedConfig = {
  '**/*.{js,mjs,ts,tsx}': ['turbo lint:js -- --fix', 'prettier --check --write'],
  '**/*.{md,mdx}': ['turbo lint:md -- --fix', 'prettier --check --write'],
  '**/*.css': ['turbo lint:css -- --fix', 'prettier --write'],
  '**/*.ts?(x)': () => 'npm run type-check',
  '**/*.{json,yaml}': ['prettier --check --write'],
};

export default lintStagedConfig;
