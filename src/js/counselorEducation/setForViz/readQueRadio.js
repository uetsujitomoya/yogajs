const readQueRadio = (name, storage, chboxlist, chboxlist2, queRadioResult, taiou, taiou2, chboxlength, queChBoxLen) => {
  let c

  let black = 0
  for (let chBoxNo = 1; chBoxNo <= queChBoxLen; chBoxNo++) {
    const radio = document.getElementById('rs' + chBoxNo).children
    for (let i = radio.length - 5, l = radio.length; i < l; i++) {
      if (radio[i].control.checked === true) {
        // storage.getItem(name+"RGBlist"+m)=
        if (radio[i].control.value === '3') {
          queRadioResult[taiou[chBoxNo - 1]] = 3
          storage.setItem(name + 'RGBlist' + chBoxNo, 3)
          break
        }
        if (radio[i].control.value === '4') {
          queRadioResult[chBoxNo - 1] = 4
          storage.setItem(name + 'RGBlist' + chBoxNo, 4)
          break
        }
        if (radio[i].control.value === '5') {
          queRadioResult[chBoxNo - 1] = 5
          storage.setItem(name + 'RGBlist' + chBoxNo, 5)
          break
        }
        if (radio[i].control.value === '6') {
          queRadioResult[chBoxNo - 1] = 6
          storage.setItem(name + 'RGBlist' + chBoxNo, 6)
          break
        }
      } else {
        queRadioResult[chBoxNo - 1] = 7
        storage.setItem(name + 'RGBlist' + chBoxNo, 7)
      }
    }
    if (queRadioResult[chBoxNo - 1] === 7) {
      black++ //なんだこれ
    }
  }
}

export{readQueRadio}