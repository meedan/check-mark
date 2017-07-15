import fs from 'fs';
const input = JSON.parse(fs.readFileSync('build/reactIntlMessages.json', 'utf8'));
let output = {};
for (let i = 0; i < input.length; i++) {
  const translation = input[i];
  output[translation.id] = translation.defaultMessage;
}
fs.writeFileSync('src/localization/en.json', JSON.stringify(output));
fs.unlinkSync('build/reactIntlMessages.json');
