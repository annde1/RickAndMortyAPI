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
  let charObj = JSON.parse(res);
  //Go to the next API
  apiAddress = charObj.info.next;
  for (let i = 0; i < charObj.results.length; i++) {
    let body = document.querySelector("body");
    let img = document.createElement("img");
    img.setAttribute("src", charObj.results[i].image);
    img.style.display = "block";
    //setting width and height to images because the image tags are created before th images are brought and the empty image tags are intersecting with the viewport
    img.style.width = "500px";
    img.style.height = "500px";
    body.appendChild(img);
  }
};
const myFunc = async () => {
  try {
    let res = await myPromise2(); //
    getImages(res);
    //options object for intersection observer api
    let opts = {
      root: null, //null because I want the last image to intersect with the viewport
      threshhold: 0.5, //around 50%
    };
    //the execution of this call back function is synchronous
    const observerCallback = (entries, observer) => {
      // console.log(entries);
      //checking if the target element is instersecting or not (entries ar an array)
      let isIntersecting = entries.some((entry) => entry.isIntersecting);

      //if it's not intersecting no need to run the funcion
      if (!isIntersecting) {
        return;
      }

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
    console.log("err", err);
  }
};

myFunc();
