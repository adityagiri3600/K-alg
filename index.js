let num_zeros = Array.from({ length: 4 }, () => []);
let num_ones = Array.from({ length: 4 }, () => []);

for (let num = 0; num < 16; num++) {
  for (let i = 0; i < 4; i++) {
    if (((num >> i) & 1) === 0) {
      num_zeros[i].push(num);
    } else {
      num_ones[i].push(num);
    }
  }
}

let classified_groups = [[]];

let letters = ['B', 'A', 'D', 'C'];

for (let i = 0; i < letters.length; i++) {
  let zero_dict = { [`${letters[i]}'`]: num_zeros[i] };
  let one_dict = { [letters[i]]: num_ones[i] };

  classified_groups[0].push(zero_dict);
  classified_groups[0].push(one_dict);
}

for (let _ = 0; _ < 3; _++) {
  let newcl = [];
  for (let i = 0; i < classified_groups[classified_groups.length - 1].length; i++) {
    for (let j = i + 1; j < classified_groups[classified_groups.length - 1].length; j++) {
      let dict1 = classified_groups[classified_groups.length - 1][i];
      let dict2 = classified_groups[classified_groups.length - 1][j];

      let key1 = Object.keys(dict1)[0];
      let key2 = Object.keys(dict2)[0];

      let intersection = [...new Set(dict1[key1].filter(num => dict2[key2].includes(num)))];
      if (intersection.length > 0) {
        let new_key = key1 + '.' + key2;
        newcl.push({ [new_key]: intersection });
      }
    }
  }
  classified_groups.push(newcl);
}

cubicTerms = [{"A'.C'.D'":[0,1]},{"A'.C'.D":[4,5]},{"A'.C.D":[12,13]},{"A'.C.D'":[8,9]},
              {"A.C'.D'":[2,3]},{"A.C'.D":[6,7]},{"A.C.D":[14,15]},{"A.C.D'":[10,11]},
              {"B'.C'.D'":[0,2]},{"B'.C'.D":[8,10]},{"B'.C.D":[12,14]},{"B'.C.D'":[4,6]},
              {"B.C'.D'":[1,3]},{"B.C'.D":[9,11]},{"B.C.D":[13,15]},{"B.C.D'":[5,7]},
              {"A'.B'.D'":[0,8]},{"A'.B'.D":[4,12]},{"A'.B.D":[5,13]},{"A'.B.D'":[1,9]},
              {"A.B'.D'":[2,10]},{"A.B'.D":[6,14]},{"A.B.D":[7,15]},{"A.B.D'":[3,11]},
              {"A'.B'.C'":[0,4]},{"A'.B'.C":[12,8]},{"A'.B.C":[13,9]},{"A'.B.C'":[1,5]},
              {"A.B'.C'":[2,6]},{"A.B'.C":[14,10]},{"A.B.C":[11,15]},{"A.B.C'":[3,7]}]
classified_groups[3] = classified_groups[2]
classified_groups[2] = cubicTerms
for (let i = 0; i < 4; i++) {
  console.log(classified_groups[i][0]);
}

function condition(value,minterms,deleted_values) {
  
  
  part1 = false
  for(let i=0;i<value.length;i++) {
    if([...minterms].includes(value[i])) {
      part1 = true;
      break;
    }
  }
  part2 = true
  for(let i=0;i<value.length;i++) {
    if(!([...deleted_values].includes(value[i])) && !([...minterms].includes(value[i]))) {
      part2 = false;
      break;
    }
  }
  return part2&&part1
  
}
let minterms = new Set([]);

function solveKmap(minterms) {
  
  let deleted_values = new Set();
  
  expression = ""
  groups = []
  
  for (let cg of classified_groups) {
    validGroups = []
    for (let group of cg) {
      let groupExpression = Object.keys(group)[0];
      let groupValues = group[groupExpression];
      if (condition(groupValues,minterms,deleted_values)) {
        groupValues.forEach(num => deleted_values.add(num));
        minterms = new Set([...minterms].filter(num => !deleted_values.has(num)));
        groups.push({value: groupValues,key: groupExpression})
      }
    }
  }
  const result = [];
  for(const group of groups){
    groupNumbers = group.value;
    const usedNumbers = new Set();
    for(const group of groups){
      if(groupNumbers !== group.value){
        for(const number of group.value){
          usedNumbers.add(number);
        }
      }
    }
    for(const number of groupNumbers){
      if(!usedNumbers.has(number)){
        result.push(group);
        break;
      }
    }
  }
  groups = result;
   
  document.getElementById('groups').innerHTML = "Groups: "
  for(let i=0;i<groups.length;i++) {
    let groupValue = groups[i].value
    let groupExpression = groups[i].key
    expression += groupExpression + " + "
    document.getElementById('groups').innerHTML += groupValue.toString() + "&nbsp&nbsp&nbsp&nbsp"
  }
  document.getElementById('expression').innerHTML = "F = " + expression.slice(0,expression.length-2)
}
solveKmap(minterms);

kmorderList = [0,1,3,2,4,5,7,6,12,13,15,14,8,9,11,10]
function kmorder(i) {
  return kmorderList[i]
}

cells = document.getElementsByClassName('cell')
for(let i=0;i<cells.length;i++) {
  cells[i].innerHTML = `<span>${kmorder(i)}</span>`
  cells[i].addEventListener('click',function() {

    if(minterms.has(kmorder(i))) {
      minterms.delete(kmorder(i))
      this.style.backgroundColor = "grey"
    } else {
      minterms.add(kmorder(i))
      this.style.backgroundColor = "rgb(140, 73, 73)"
    }
    solveKmap(minterms)
    console.log(groups)
  })
}