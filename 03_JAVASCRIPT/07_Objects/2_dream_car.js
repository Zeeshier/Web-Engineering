const car = {
    model : "Honda",
    year : 2010,
    color :"Blue",
    used : false
  };
  
  if(car.used===true){
  console.log("I'm looking for a "+ car.year + " " +  car.model +" that is used.");
  } else {
  console.log("I'm looking for a "+ car.year + " " +  car.model +" that is new.");
  }