// if the message list retrieved on a project has no messages yet - postgres returns [{id:null,'message':null}]. changing it to just []

const message_list_cleaner = (results) => {
  let newResults = []
  results.map((result) => {
    if (result.messages[0].id == null){
      result.messages = []
      newResults.push(result);
    }else{
      newResults.push(result);
    }
  })
  return newResults;
}

export default message_list_cleaner;
