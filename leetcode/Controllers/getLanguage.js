
const axios =require("axios");
const { response } = require("express");
function getLanguageId(lang){
    const language={
        "c++":54,
        "python":71,
        "javascript":63 
    }
    return language[lang.toLowerCase()] 
   
}




   

async function submitBatch(submissions){


   

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': 'e9c6971c3dmsh9c131dbf2ceac83p1c1a57jsn7d61c9dbbc1b',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions,
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data
    
        
	} catch (error) {
		 console.error("Error in submitBatch:", error.response?.data || error);
    throw error;
	}
}

return await fetchData(); 




}

// async function waiting(timer){
//     setTimeout(() => {
//         return 1
//     }, timer);
// }

function waiting(timer) {
  return new Promise((resolve) => setTimeout(resolve, timer));
}


async function submitToken(resultToken){



const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(","),
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': 'e9c6971c3dmsh9c131dbf2ceac83p1c1a57jsn7d61c9dbbc1b',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

while(true){
const result=await fetchData();

const isResultObtain =result.submissions.every((r)=> r.status_id>2);

if(isResultObtain){
    return result.submissions
}

await waiting(1000)

}

}


module.exports={getLanguageId,submitBatch,submitToken}