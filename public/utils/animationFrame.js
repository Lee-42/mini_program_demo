// 开启定时器
const setAnimationFrame = (render, time) => {
  let nowTime = 0, lastTime = Date.now(), diffTime = time;
  const timer = {};

  // loop函数
  async function animloop() {
    nowTime = Date.now();
    if (nowTime - lastTime > diffTime) {
      lastTime = nowTime
      await render();
    }
    timer.id = requestAnimationFrame(animloop);
  }


  animloop();
  return timer;
}

// 清除定时器
const clearAnimationFrame = (timer) => {
  if (timer && timer.id) {
    cancelAnimationFrame(timer.id)
  }
}

export {
  setAnimationFrame,
  clearAnimationFrame,
}