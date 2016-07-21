export const skillOptions = (coll) => {
  console.log('coll : ',coll)
  let newColl = [];
  coll.map((skill) => {
    let newSkill = {};
    newSkill.value = skill.name;
    newSkill.label = skill.name;
    newColl.push(newSkill)
  })
  console.log('newColl is : ',newColl)
  return newColl
}

export const categoryOptions = (coll) => {
  console.log('coll : ',coll)
  let newColl = [];
  coll.map((category) => {
    let newCategory = {};
    newCategory.value = category.name;
    newCategory.label = category.name;
    newColl.push(newCategory)
  })
  return newColl;
}
