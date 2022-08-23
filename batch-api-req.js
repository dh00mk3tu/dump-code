// Preface
// This snippet/logic basically allows you to make large amounts of API calls, "Effectively".
// I've put emphasis on saying that it is effective is because, this logic doesn't put strain on your machine.

// It's primary usecase is inside a browser. But you can use it inside your business logic as well on a server. Without the browser, 
// the logic allows you to fully utilise system resources (not recommended tho)


const rows = []; // This is the array of data, on which we will iterate over. 
// Let's assume there are 500k+ values in the above array called "rows". Those values, homogenous of course can be numbers, strings or objects.
// Now, let us assume that the API that we're trying to hit, we have to add all the values that are stored in our array, one by one.
// This would mean, we will have to make rows.length number of API calls.

// With that logic, if each requests take 1s to complete and if we do it synchronously, it'll take 500K+ seconds to complete the process.

// Therefore, we will batch our requests. 
// Remember, it depends what language you're using. JS is single threaded, hence we cannot put all the requests in the stack to process it. It'll 
// get overlaoded or put a lot of strain on the stack.
// To solve this, we will simply batch our requests.



const batchSize = 100; // This is the size of one single batch. For browsers, on a decent computer, I'd recommend to keep it between 100-250.
const batchLimit = rows.length / batchSize; // Limit of a batch.

// Note that this is an async function
async function uploadCall(thisData, index) {
    
  await makeSomeAPICall({  
    onSuccess: function(data) {
      console.log("Uploaded: ", index);
    }
  });  
}

// Main function is async as well
async function main() {
  for(let batchNumber = 0; batchNumber < batchLimit; batchNumber++){
    const batchStart = batchNumber * batchSize;
    const batchEnd = batchStart + batchSize;
    const batch = rows.slice(batchStart, batchEnd);

    console.log("Running batch " + batchNumber);
    const promises = batch.map((item) => {
       return UploadGameStatsToFirebase.trigger({
         additionalScope: {
           data: item
         }
       });
    });
    await Promise.all(promises); // Here we await for the promise returned by API call
  } 
  console.log("Finished running all batches");
}