import request from "postman-request";

const forecast = (latitude, longitude, callback) => {
  const url =
    "http://api.weatherstack.com/current?access_key=79b2c6f9866e0e2ee42c7062f9cf1193&query=" +
    latitude +
    "," +
    longitude +
    "&units=f";
  request({ url, json: true }, (error, { body }) => {
    // console.log(response.body);
    if (error) {
      callback("Unable to connect to Weather service!", undefined);
    } else if (body.error) {
      callback("Unable to find location", undefined);
    } else {
      const data = body.current;
      callback(
        undefined,
        `${data.weather_descriptions[0]}. It is currently ${data.temperature} degrees out. There is a ${data.precip}% chance of rain.`
      );
    }
  });
};

export { forecast };
