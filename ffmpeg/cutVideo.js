const { execSync } = require('child_process')
const path = require('path')
const videoPath = path.join(__dirname, 'static/video')
//-ss起始时间  -to 起始时间 -i放前面会报错
execSync(`ffmpeg -ss 2 -to 4 -i ${videoPath}/hover.mp4 ${videoPath}/hover3.mp4`, {stdio: 'inherit'})