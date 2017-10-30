const downloadTask = (arr) => {
  var data = JSON.stringify(arr);
  var a = document.createElement('a');
  a.textContent = 'export';
  a.download = 'tasks.json';
  a.href = window.URL.createObjectURL(new Blob([data], { type: 'text/plain' }));
  a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');

  var exportLink = document.getElementById('export-link');
  console.log(exportLink)
  exportLink.appendChild(a);
}

export {downloadTask}