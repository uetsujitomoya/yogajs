const downloadJson=(obj)=>{
  let a = document.querySelector('.download');
  //var obj = { hoge: 1, fuga: 2 , piyo: 3 };
  const blob = new Blob(
    [JSON.stringify(obj)],
    { type: 'application\/json' }
  );
  const url = URL.createObjectURL(blob);

  a.download = 'data.json';
  a.href = url;
  a.classList.remove('disabled');
}

export {downloadJson}