export const skillOptions = (coll) => {
  let newColl = [];
  coll.map((skill) => {
    let newSkill = {};
    newSkill.value = skill.name;
    newSkill.label = skill.name;
    newColl.push(newSkill)
  })
  return newColl
}

export const categoryOptions = (coll) => {
  let newColl = [];
  coll.map((category) => {
    let newCategory = {};
    newCategory.value = category.name;
    newCategory.label = category.name;
    newColl.push(newCategory)
  })
  return newColl;
}

// The above help to turn the suggested skill-set returned by the server
// to valid {value,label} options to be used by react-select. They could probably be meshed as one function.
// seeing that they both accomplish the same thing anyway.
