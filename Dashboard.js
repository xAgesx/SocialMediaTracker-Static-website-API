
let table = document.querySelector(".following-table"); 
let countries = [];
let countriesNb = [];
let AgePools = ["0 - 10","10 - 20","20 - 30" , "30 - 40" , "40 - 50" ,
                "50 - 60","60 - 70" ,"70 - 80" ,"80 - 90" , "90 +" ];
let AgePoolsNb = [0,0,0,0,0,0,0,0,0,0] ;

async function fetchResults() {
    console.log("appel de fetchResults");
    try {
        const response = await fetch('https://randomuser.me/api?results=20');
        console.log(response);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données : ' + response.status);
        }
        const data = await response.json();
        
        displayResults(data);
        displayCountriesChart(data);
        displayAgeChart(data);
        displayPlatformsChart(data);

    } catch (error) {
        
        console.error(error);
        table.innerHTML = `<p>Une erreur est survenue : ${error.message}</p>`;
    }
}
function displayResults(results) {
    console.log(results);
    for ( let i = 0 ; i < 5 ; i++){
        const tr = document.createElement('tr');
        const tdName= document.createElement('td');
        const tdDate = document.createElement('td');
        
        tdName.innerHTML = '@'+results.results[i].name.first  ;
        tdDate.innerHTML = '2025'+results.results[i].registered.date.substring(4,10) ;
        
        table.appendChild(tr);
        tr.appendChild(tdName);
        tr.appendChild(tdDate);
    }
}
function SortBubble(arr1, arr2) {
    const n = arr1.length;
    let swapped;
  
    do {
      swapped = false;
      for (let i = 0; i < n - 1; i++) {
        if (arr1[i] < arr1[i + 1]) { 
          [arr1[i], arr1[i + 1]] = [arr1[i + 1], arr1[i]];
          [arr2[i], arr2[i + 1]] = [arr2[i + 1], arr2[i]];
  
          swapped = true;
        }
      }
    } while (swapped);
  }
function SumArr(arr){
    let S = 0 ;
    for(let i = 0 ; i< arr.length ; i++){
        S = S + arr[i];
    }
    return S;
  }
  function displayAgeChart(results) {
    
    const ctx = document.getElementById('chartContainerAge').getContext('2d');
    let Sum = 0 ;
    console.log(Sum)
    for (let i = 0; i < 20; i++) {
        let Age = results.results[i].dob.age ;
        let poolIndex = Math.floor(Age/10);
        if(poolIndex < 10){
            AgePoolsNb[poolIndex]++;
        }else{
            AgePoolsNb[9]++ ;
        }
          
      }
     SortBubble(AgePoolsNb,AgePools);
      Sum = SumArr(AgePoolsNb);


const data = {
    labels: [AgePools[0],AgePools[1],AgePools[2],AgePools[3],AgePools[4]
    ],
    datasets: [{
        label: 'Percentage',
        data: [AgePoolsNb[0]/Sum*100,AgePoolsNb[1]/Sum*100,AgePoolsNb[2]/Sum*100,AgePoolsNb[3]/Sum*100,AgePoolsNb[4]/Sum*100], 
        backgroundColor: [
            'gold',
            'pink',
            'cyan',
            'goldenrod',
            'silver'
        ],
    }]
};

const config = {
    type: 'pie', 
    data: data,
    options: {
        responsive: true, 
        plugins: {
            legend: {
                position: 'top', 
            },
            title: {
                display: true,
                text: "Demographic partition based on Age" 
            }
        }
    }
};

new Chart(ctx, config);
}
function displayCountriesChart(results) {
    
    const ctx = document.getElementById('chartContainerCountries').getContext('2d');
    let Sum = 0 ;
    console.log(Sum)
    for (let i = 0; i < 20; i++) {
        let index = countries.indexOf(results.results[i].location.country);
        if ( index !== -1) { 
          countriesNb[index]++;
        } else {
          countries.push(results.results[i].location.country);
          countriesNb.push(1);
        }
      }
      SortBubble(countriesNb,countries);
      Sum = SumArr(countriesNb);


const data = {
    labels: [
        countries[0],countries[1],countries[2],countries[3],countries[4]
    ],
    datasets: [{
        label: 'Percentage',
        data: [countriesNb[0]/Sum*100,countriesNb[1]/Sum*100,countriesNb[2]/Sum*100,countriesNb[3]/Sum*100,countriesNb[4]/Sum*100], 
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'Green',
            'purple'
        ],
    }]
};

const config = {
    type: 'pie', 
    data: data,
    options: {
        responsive: true, 
        plugins: {
            legend: {
                position: 'top', 
            },
            title: {
                display: true,
                text: "Geographic partition of the most 5 active countries" 
            }
        }
    }
};

new Chart(ctx, config);
}
function displayPlatformsChart(results){
    const ctx = document.getElementById('chartContainerPlatforms').getContext('2d');
    const DATA_COUNT = 4;


const data = {
  labels: ['LinkedIn', 'X(Twitter)', 'Facebook', 'Instagram'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [10,25.6,30.4,43],
      backgroundColor: ['red','blue','purple','orange'],
      
    }
  ]
};

const config = {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart.js Doughnut Chart'
        }
      }
    },
  };

new Chart(ctx, config);
}
function displayUsername(){
  let username = null ;
  try{
    username = localStorage.getItem('username');
  }catch{
    console.log("error fetching username");
    return;
  }
    const usernameContainer = document.getElementById("user-name");

    if(username){
      usernameContainer.textContent = username ;
    }
    else{
      console.log("Error displaying username");
    }
}

displayUsername();
fetchResults();