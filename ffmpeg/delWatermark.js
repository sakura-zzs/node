const { execFile } = require('child_process')
const path = require('path')
const videoPath = path.join(__dirname, 'static/video')
// delogo 去除指定位置指定大小的水印
execFile('ffmpeg', ['-i', `${videoPath}/hover1.mp4`,'-vf','delogo=w=120:h=30:x=10:y=10', `${videoPath}/hover2.mp4`], (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`)
    return
  }
})