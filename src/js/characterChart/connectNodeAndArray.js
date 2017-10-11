const connectNodeAndArray = (array,r) => {
  //nodeとarrayを紐付ける

  array.nodeDataArray = [ [ array.subject.x , array.object.y , r ] , [ array.object.x , array.object.y , r ] ]
}

export {connectNodeAndArray}