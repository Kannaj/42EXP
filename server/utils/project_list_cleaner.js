// problem - When querying project list. Postgres returns results in the below format for skills column
// [ {skills_id: 9 ,skill_name: 'Python'}] if value is present else - [{skills_id:null,skill_name:null}]
//the cleanser would replace skill with [] if skills_id is null


const project_list_cleaner = (results) => {
  let newResults = []
  results.map((result) => {
    if(result.skills === null){
      newResults.push(result)
    }
    else if (result.skills[0].skill_id == null){
      result.skills = []
      newResults.push(result)
    }else{
      newResults.push(result)
    }
  })
  return newResults;
}

export default project_list_cleaner;
