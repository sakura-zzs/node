const { execFile } = require('child_process')
const path = require('path')
const videoPath = path.join(__dirname, 'static/video')
// -vf 加视频滤镜 video filter
execFile('ffmpeg', ['-i', `${videoPath}/hover.mp4`,'-vf','drawtext=text="抽象":fontsize=30:fontcolor=#000000:x=10:y=10', `${videoPath}/hover1.mp4`], (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`)
    return
  }
})