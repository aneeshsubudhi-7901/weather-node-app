import request from "postman-request";

const geocode = (address, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=pk.eyJ1IjoiYW5lZXNoczc5MDEiLCJhIjoiY2tvNjYzNWo3MG80NzJ2bjA0eGlmanBzYiJ9.yOT8zkaZmA94sMJfaHiK3Q&limit=1`; //know why encodeURi is used

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Not able to connect to Location service!", undefined);
    } else if (body.features.length === 0) {
      callback("Unable to find location. Try another search.", undefined);
    } else {
      callback(undefined, {
        location: body.features[0].place_name,
        latitude: body.features[0].center[1],
        longitude: body.features[0].center[0],
      });
    }
  });
};

export { geocode };
