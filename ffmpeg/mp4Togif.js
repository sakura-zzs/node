const { execFile } = require('child_process')
const path = require('path')
const videoPath = path.join(__dirname, 'static/video')
// -i 输入
execFile('ffmpeg', ['-i', `${videoPath}/hover.mp4`, `${videoPath}/hover.gif`], (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`)
    return
  }
})