import moment from "moment";
import format from "date-fns/format";

// import newa from "assets/newa.svg";
// import newaGray from "assets/newaGray.svg";
// import airport from "assets/airport.svg";
// import airportGray from "assets/airportGray.svg";

import {
  isBefore,
  startOfDay,
  addHours,
  setHours,
  setMinutes,
  setSeconds,
  isEqual,
} from "date-fns";

// PRE FETCHING ---------------------------------------------------------
export const matchIconsToStations = (station, state) => {
  const protocol = window.location.protocol;
  const { network } = station;
  const { postalCode } = state;

  const newa = `${protocol}//newa2.nrcc.cornell.edu/gifs/newa_small.png`;
  const newaGray = `${protocol}//newa2.nrcc.cornell.edu/gifs/newa_smallGray.png`;
  const airport = `${protocol}//newa2.nrcc.cornell.edu/gifs/airport.png`;
  const airportGray = `${protocol}//newa2.nrcc.cornell.edu/gifs/airportGray.png`;
  const culog = `${protocol}//newa2.nrcc.cornell.edu/gifs/culog.png`;
  const culogGray = `${protocol}//newa2.nrcc.cornell.edu/gifs/culogGray.png`;

  if (
    network === "newa" ||
    network === "njwx" ||
    network === "miwx" ||
    network === "oardc" ||
    network === "nysm" ||
    network === "nwon" ||
    ((network === "cu_log" || network === "culog") && station.state !== "NY")
  ) {
    return station.state === postalCode || postalCode === "ALL"
      ? newa
      : newaGray;
  }

  if (network === "cu_log" || network === "culog") {
    return station.state === postalCode || postalCode === "ALL"
      ? culog
      : culogGray;
  }

  if (network === "icao") {
    return station.state === postalCode || postalCode === "ALL"
      ? airport
      : airportGray;
  }
};

// Handling Temperature parameter and Michigan network id adjustment
export const networkTemperatureAdjustment = (network) => {
  // Handling different temperature parameter for each network
  // if (
  //   network === "newa" ||
  //   network === "icao" ||
  //   network === "njwx" ||
  //   network === "oardc"
  // ) {
  //   return "23";
  // } else if (
  //   network === "miwx" ||
  //   network === "cu_log" ||
  //   network === "culog"
  // ) {
  //   return "126";
  // }
  return vXDef[network]["temp"];
};

export const vXDef = {
  newa: {
    pcpn: 5,
    temp: 23,
    rhum: 24,
    lwet: 118,
    wspd: 128,
    wdir: 130,
    srad: 132,
    st4i: 120,
    sm4i: 65,
  },
  icao: { pcpn: 5, temp: 23, rhum: 24, wspd: 28, wdir: 27, dwpt: 22 },
  cu_log: {
    pcpn: 5,
    temp: 126,
    rhum: 24,
    lwet: 118,
    wspd: 128,
    wdir: 130,
    srad: 132,
  },
  culog: {
    pcpn: 5,
    temp: 126,
    rhum: 24,
    lwet: 118,
    wspd: 128,
    wdir: 130,
    srad: 132,
  },
  njwx: { pcpn: 5, temp: 23, rhum: 24, wspd: 28, wdir: 27, srad: 149 },
  miwx: { pcpn: 5, temp: 126, rhum: 143, lwet: 118, srad: 132 },
  oardc: {
    pcpn: 5,
    temp: 23,
    rhum: 24,
    lwet: 118,
    wspd: 28,
    wdir: 27,
    srad: 132,
    st4i: 120,
  },
  nysm: {
    pcpn: 5,
    temp: 23,
    rhum: 24,
    wspd: 28,
    wdir: 27,
    srad: 132,
    st4i: 120,
    sm2i: 104,
  },
  nwon: {
    pcpn: 5,
    temp: 23,
    rhum: 24,
    lwet: 118,
    wspd: 28,
    wdir: 27,
    srad: 132,
  },
};

// Handling Relative Humidity Adjustment
export const networkHumidityAdjustment = (network) =>
  network === "miwx" ? "143" : "24";

// Handling Michigan state ID adjustment
export const michiganIdAdjustment = (station) => {
  if (
    station.state === "MI" &&
    station.network === "miwx" &&
    station.id.slice(0, 3) === "ew_"
  ) {
    // example: ew_ITH
    return station.id.slice(3, 6);
  }
  return station.id;
};

// Returns the average of two numbers.
export const avgTwoStringNumbers = (a, b) => {
  const aNum = parseFloat(a);
  const bNum = parseFloat(b);
  return Math.round((aNum + bNum) / 2).toString();
};

export const replaceNonConsecutiveMissingValues = (arr) => {
  return arr.map((t, i) => {
    if (i === 0 && t === "M") {
      return arr[i + 1];
    } else if (i === arr.length - 1 && t === "M") {
      return arr[i - 1];
    } else if (t === "M" && arr[i - 1] !== "M" && arr[i + 1] !== "M") {
      return avgTwoStringNumbers(arr[i - 1], arr[i + 1]);
    } else {
      return t;
    }
  });
};

// Returns rh array containing new values.
// The new values are calculated according to the equation below.
export const RHAdjustment = (arr) => {
  return arr.map((e) => {
    if (e !== "M") {
      return Math.round(parseFloat(e) / (0.0047 * parseFloat(e) + 0.53));
    } else {
      return e;
    }
  });
};

// Returns average of all the values in array
export const average = (data) => {
  // handling the case for T and W
  if (data.length === 0) return 0;

  //  calculating average
  let results = data.map((e) => parseFloat(e));
  return Math.round(results.reduce((acc, val) => acc + val, 0) / data.length);
};

// Returns array with elements above the second argument of the function
export const aboveValue = (data, value) => {
  return data.map((e) => {
    if (e > value) {
      return e;
    }
    return false;
  });
};

// Returns array with elements equal to and above the second argument of the function
export const aboveEqualToValue = (data, value) => {
  return data.map((e) => {
    if (e >= value) {
      return e;
    }
    return false;
  });
};

export const delay = (t) => {
  return new Promise((res) => {
    setTimeout(res, t);
  });
};

export const roundDate = (date, duration, method) => {
  return moment(Math[method](+date / +duration) * +duration);
};

// export const dailyToHourlyDates = arr => {
//   let results = [];
//   arr.forEach((date, d) => {
//     date[1].forEach((temp, h) => {
//       let hour = h + 1;
//       if (h >= 0 && h <= 8) hour = `0${h + 1}`;
//       results.push({
//         date: `${date[0]} ${hour}:00`,
//         temp
//       });
//     });
//   });
//   return results;
// };

export const dailyToHourlyDates = (arr) => {
  let results = [];
  arr.forEach((date, d) => {
    date[1].forEach((temp, h) => {
      let hour = h;
      if (h >= 0 && h <= 9) hour = `0${h}`;
      // console.log(date, `${date[0]} ${hour}:00`);
      results.push({
        date: `${date[0]} ${hour}:00`,
        temp,
      });
    });
  });
  // console.log(results);
  return results;
};

export const dailyToHourlyDatesNEW = (sdate, edate) => {
  let startDay = startOfDay(sdate);
  let endDay = setHours(edate, 23);
  endDay = setMinutes(endDay, 0);
  endDay = setSeconds(endDay, 0);
  // console.log(startDay, endDay);
  let results = [];
  results.push(startDay);

  while (isBefore(startDay, endDay)) {
    startDay = addHours(startDay, 1);
    if (isBefore(startDay, endDay) || isEqual(startDay, endDay)) {
      results.push(startDay);
    }
  }
  // console.log(results);
  return results;
};

export const formatDate = (date) => {
  return format(date, "MM/DD/YY HH:00");
};

export const IncrementTemp = (data) => {
  return data.map((arr) => {
    return [
      arr[0],
      arr[1].map((t) => (t === "M" ? t : (Number(t) + 30).toString())),
    ];
  });
};

const range = (start, end) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

export const disableFutureHrs = (date) => {
  return range(0, 24).splice(moment(date).hour() + 1);
};

export const disablePastHrs = (date) => {
  return range(0, 24).splice(0, moment(date).hour() + 1);
};
