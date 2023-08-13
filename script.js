let apiAddress = "https://rickandmortyapi.com/api/character";

const myPromise2 = () => {
  return new Promise((resolve, reject) => {
    const xhr3 = new XMLHttpRequest(); // create object to send ajax request

    xhr3.onload = () => {
      // console.log("xhr3", xhr3);
      // console.log("status3", xhr3.status);
      // console.log("response3", xhr3.response);

      if (xhr3.status == 200) {
        resolve(xhr3.response);
      } else {
        reject(error);
      }
    };

    xhr3.open("GET", apiAddress);
    xhr3.send(); // send the request
  });
};

const getImages = (res) => {
  //if the promise success then the result will be in myValue
  let charObj = JSON.parse(res);
  apiAddress = charObj.info.next;
  for (let i = 0; i < charObj.results.length; i++) {
    let body = document.querySelector("body");
    let img = document.createElement("img");
    //console.log(item.image);
    img.setAttribute("src", charObj.results[i].image);
    img.style.display = "block";
    //setting width and height to images because the image tags are created before th images are brought and the empty image tags are intersecting with the viewport
    img.style.width = "500px";
    img.style.height = "500px";
    body.appendChild(img);
  }
};
const myFunc = async () => {
  //async mean that there will be promise in this function
  try {
    let res = await myPromise2(); //
    getImages(res);
    //options object for intersection observer api
    let opts = {
      root: null, //null because I want the last image to intersect with the viewport
      threshhold: 0.5, //around 50
    };
    const observerCallback = (entries, observer) => {
      // console.log(entries);
      //checking if the target element is instersecting or not
      let isIntersecting = entries.some((entry) => entry.isIntersecting);

      //if it's not intersecting no need to run the funcion
      if (!isIntersecting) {
        return;
      }

      //the execution of the callback is synchronous (the inside of it)
      //we want to delete the previous observer (there can only be one observer)
      entries.forEach((entry) => observer.unobserve(entry.target));
      //bring more images
      myFunc();
    };
    //getting the last image and observing it
    let body = document.querySelector("body");
    let lastElement = body.lastElementChild;
    //creating new oberver
    let observer = new IntersectionObserver(observerCallback, opts);
    //observe the last picture.
    observer.observe(lastElement);
  } catch (err) {
    //if promise fail then it will go to catch and will put the error msg to err
    console.log("err", err);
  }
};

myFunc();
