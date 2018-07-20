import fs from 'fs';
import config from '../config';
console.log('Application is ' + config.appName + '...');

const files = [
  'app.json',
  'public/manifest.json',
  'android/app/src/main/res/values/strings.xml',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/build.gradle',
  'android/app/src/main/java/com/checkmark/MainApplication.java',
  'android/app/src/main/java/com/checkmark/MainActivity.java',
  'android/app/src/main/assets/login.html'
];

const operation = process.argv[2];

if (operation === 'brand') {
  files.forEach((file) => {
    console.log('Rebranding ' + file + '...');
    let input = fs.readFileSync(file, 'utf8');
    let output = input.replace(new RegExp('{APP_NAME}', 'g'), config.appName);
    output = output.replace(new RegExp('{APP_API_URL}', 'g'), config.checkApiUrl);
    output = output.replace(new RegExp('{APP_DESCRIPTION}', 'g'), config.appDescription);
    output = output.replace(new RegExp('{APP_ID}', 'g'), config.appId);
    fs.writeFileSync(file, output);
  });

  // Android images
  ['xxh', 'm', 'xh', 'h'].forEach((size) => {
    fs.createReadStream(`android/app/src/main/res/${config.appId}/mipmap-${size}dpi/ic_launcher.png`).pipe(fs.createWriteStream(`android/app/src/main/res/mipmap-${size}dpi/ic_launcher.png`));
  });
}

else if (operation === 'unbrand') {
  files.forEach((file) => {
    console.log('Unbranding ' + file + '...');
    let input = fs.readFileSync(file, 'utf8');
    let output = input.replace(new RegExp(config.appName, 'g'), '{APP_NAME}');
    output = output.replace(new RegExp(config.checkApiUrl, 'g'), '{APP_API_URL}');
    output = output.replace(new RegExp(config.appDescription, 'g'), '{APP_DESCRIPTION}');
    output = output.replace(new RegExp(config.appId, 'g'), '{APP_ID}');
    fs.writeFileSync(file, output);
  });
}
