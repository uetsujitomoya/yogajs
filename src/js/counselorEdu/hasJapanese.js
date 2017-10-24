/**
 * Created by uetsujitomoya on 2017/08/09.
 */

// checkJa(panese)

function hasJapanese (txt) {
  if (typeof txt !== 'string') {
    return false
  }

  var i = txt.length,
    escapeTxt

  while (i--) {
    escapeTxt = escape(txt.substring(i, i + 1))
    if (escapeTxt.length >= 6) {
      return true
    }
  }

  return false
}

export {hasJapanese}
