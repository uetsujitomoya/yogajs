const isEOHatsugen = (keitaisokaisekiWordObj) => {
  if(  keitaisokaisekiWordObj.basic_form === '。' || keitaisokaisekiWordObj.basic_form === '？' || keitaisokaisekiWordObj.basic_form === '?' || keitaisokaisekiWordObj.basic_form === '：' || keitaisokaisekiWordObj.basic_form === ':' || keitaisokaisekiWordObj.word_id === '2613630' || keitaisokaisekiWordObj.surface_form === '･･･？：' || keitaisokaisekiWordObj.surface_form === ')：' ||
  keitaisokaisekiWordObj.surface_form === '…' || keitaisokaisekiWordObj.surface_form === '……' || keitaisokaisekiWordObj.surface_form === '・・・' || keitaisokaisekiWordObj.surface_form === '･･･' || keitaisokaisekiWordObj.surface_form.indexOf('〈') !== -1 || keitaisokaisekiWordObj.surface_form.indexOf('〉') !== -1){
    return true
  }else{
    return false
  }
}

export {isEOHatsugen}