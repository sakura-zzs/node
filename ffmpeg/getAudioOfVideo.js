const { execSync } = require('child_process')
const path = require('path')
const videoPath = path.join(__dirname, 'static/video')
execSync(`ffmpeg -i ${videoPath}/hover.mp4 ${videoPath}/hover.mp3`, {stdio: 'inherit'})