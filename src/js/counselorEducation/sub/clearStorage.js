const clearStorage = () => {
  localStorage.clear();
  window.localStorage.clear();
  console.log("clearStorage!")
}

export {clearStorage}