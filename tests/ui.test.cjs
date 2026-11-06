const { test } = require('node:test');
const assert = require('node:assert/strict');
const render = require('./render.cjs');
for (const name of ['Ana','Luis']) {
  test('profile properties and missing image '+name, async () => {
    const html = await render("import ProfileCard from './src/components/ProfileCard.jsx';", `<ProfileCard name="${name}" description="Descripción comprobada" />`);
    assert.ok(html.includes(`Perfil sin imagen: ${name}`));
    assert.ok(html.includes('Descripción comprobada'));
    assert.ok(!html.includes('https://'));
  });
}
