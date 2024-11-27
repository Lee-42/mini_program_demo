import { setAnimationFrame, clearAnimationFrame } from "../../utils/animationFrame";

const NTDev = window.NTDev || parent.NTDev || {}
/**
 * 查询高拍仪错误信息
 */
const getErrMsg = () => {
  if (NTDev && NTDev.carema) {
    NTDev.carema.getLastErrorMsg(1024, (err) => {
      console.error(`NTDev.carema.getLastErrorMsg - err:`, err);
    });
  }
}


/**
 * 打开摄像头，获取视频流
 * @param {'main' | 'sec'} type 主/辅摄像头
 * @param {(buff, size) => {}} callback 回调函数，接收一个buffer数据用于渲染显示，可直接用于img元素的src属性
 * @param {number} frame 视频最低帧数
 * @returns function 一个关闭摄像头的函数，可以直接执行
 */
const openCamera = (type = "sec", callback, frame = 60) => {
  if (NTDev && NTDev.carema) {
    const camera = NTDev.carema
    let index = 0;
    let timer = null;

    // 关闭摄像头
    const closeCamera = () => {
      // 清除定时器
      clearAnimationFrame(timer);
      // 关闭摄像头
      camera.closeCamera();
    }

    if (type === "main") {
      // 获取主摄像头索引
      index = camera.getMainCamera();
    }
    else if (type === "sec") {
      // 获取辅摄像头索引
      index = camera.getAuxCamera();
    }

    // 打开摄像头
    console.log("打开摄像头", index);
    const openCode = camera.openCamera(index);

    if (openCode == 0) {
      // 传输视频流
      if (typeof callback === "function") {
        timer = setAnimationFrame(() => new Promise(resolve => {
          camera.getFrameBuffer((buf, size) => {
            try {
              // 尝试执行回调
              resolve(callback(buf, size));
            } catch (error) {
              // 如果回调报错，停止执行
              console.error(error);
              closeCamera();
            }
          })
        }), 1000 / frame);
      }
    } else {
      getErrMsg();
    }

    return closeCamera
  }
}

/**
 * 快速拍照，该方法将执行以下步骤：打开摄像头 - 拍一张照片 - 关闭摄像头
 * @param {'main' | 'sec'} type 主/辅摄像头
 * @param {(url) => {}} callback 回调函数，接收一个本地文件路径
 */
const quickCapture = (type = "sec", callback) => {
  const camera = NTDev.carema
  let index = 0;

  if (type === "main") {
    // 获取主摄像头索引
    index = camera.getMainCamera();
  }
  else if (type === "sec") {
    // 获取辅摄像头索引
    index = camera.getAuxCamera();
  }

  // 打开摄像头
  console.log("打开摄像头", index);
  const openCode = camera.openCamera(index);

  if (openCode == 0) {
    if (typeof callback === "function") {
      camera.capture(callback);
      camera.closeCamera();
    }
  } else {
    getErrMsg();
  }
}

const getCamera = {
  openCamera,
  quickCapture,
}

export default getCamera