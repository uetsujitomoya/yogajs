let makeOnClick = (c) => {
  document.getElementById('b' + c).onclick = () => {
    const id = 'r' + c
    document.getElementById(id).classList.toggle('hide')
  }
}
let makeOnClickS = (c) => {
  document.getElementById('bs' + c).onclick = () => {
    const id = 'rs' + c
    document.getElementById(id).classList.toggle('hide')
  }
}
