import { timeStampDto } from "../dto/log_dtos"
import { metricPatialData } from "../types/interface"

export const parseTimestamp = (timestamp: string, minutes: number) => {
   const newTimestamp = new Date(timestamp)
    return newTimestamp.getTime() + (minutes * 60 * 1000)
}

// const orderedKeys = ['year', 'month', 'day', 'hour', 'minute'] as const;
// type TimeKeys = typeof orderedKeys[number];

// export function validateTimeQuery(query: timeStampDto) {

//   for (let i = 0; i < orderedKeys.length; i++) {
//     const key = orderedKeys[i];
//     const nextKeys = orderedKeys.slice(0, i); // keys must be sequential

//     if (nextKeys.some(k => !query[k])) {
//       throw new Error(`${key} cannot be used without ${nextKeys.join(', ')}`);
//     }
//   }
// }


 export function buildTimestamp({
  year,
  month,
  day,
  hour,
  minute
}: timeStampDto) {
  // Fill defaults if missing
  const finalYear = year;
  const finalMonth = (month ?? 1) - 1; // JS months are 0-indexed!
  const finalDay = day ?? 1;
  const finalHour = hour ?? 0;
  const finalMinute = minute ?? 0;

  const date = new Date(finalYear, finalMonth, finalDay, finalHour, finalMinute);
  return date
}

export function processData(data: string) {
  // replace # HELP with ][ HELP
  const data1 = data.replace(/# HELP/g, '],[ HELP');
  //replace the first ] with ''
  const data2 = data1.replace('],[ HELP', '[[ HELP');
  // replace the last char \n with ]
  const newData2 = data2.slice(0, -1) + ']]';
  const modifiedData = newData2.replace(/\n/g, '++');

  // remove outer bracket
  let trimData = modifiedData.trim();
  if (trimData.startsWith('[')) trimData = trimData.slice(1);
  if(trimData.endsWith(']')) trimData = trimData.slice(0, -1);

  // split the text by the charcter ],\[
    const splittedData = trimData.split(/\],\[/);
  
  // loop through array and make all items string
  const result = splittedData.map((arr) => {
     // Remove any remaining brackets
    arr = arr.replace(/^\[|\]$/g, '');

    // Split by comma, trim spaces
    const items = arr.split('++').map(s => s.trim()).filter(Boolean);
    // console.log(items)

    // Wrap each item in quotes fo JSON
    return items
  })

 return result;
}

export function extractData (modifiedData: any): metricPatialData {
            
    const metricData: metricPatialData = {
      metricName: '',
      metricType: '',
    }

  for (let i = 0; i < modifiedData.length; i++) {
      console.log(modifiedData)
        // get the 2nd and 3rd items in the second item in the array
        const splittedData1 = modifiedData[1].split(" ");
        const [metricName, metricType] = splittedData1.slice(2);
        console.log(`metric name & type ${metricName}, ${metricType}`)
        // get the 3rd to last item in the array
        if (!modifiedData.slice(2)) {
            metricData.metricName = metricName;
            metricData.metricType = metricType;
            return metricData
        }
        let label: Array<string> | string = [];
        const metricRes = modifiedData.slice(2);
        for (let i = 0; i < metricRes.length; i++) {
          // const start = metricRes.indexOf(['{']);
          // if (start !== -1) {
          // const eachLabel = metricRes.slice(start);
          //   label.push(eachLabel);
          // } else  { 
          // }
          label.push(metricRes);
        }
          metricData.metricName = metricName;
          metricData.metricType = metricType;
          metricData.label = label
      }
      return metricData
}


// get the metrics according to metric name on the list item
// publish to rabbitMq
export function processItem (metricName: string, hostName: string) {
    console.log(`processing item ${metricName}`)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            fetch(`http://${hostName}/api/v1/query?query=${metricName}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! Status: ${res.status}`);
                    }
                    resolve(res.json())
                }).catch((error) => reject('unable to fetch metric data ' + error))
        }, 2000);
    })
}
// fetch metrics from prometeus api
export async function getFullMetricsData(serverUrl: string): Promise<string[]> {
    // get the list of available metrics in prometheus
    // let  metricsList: Array<string>;
    const endPoint: string = `https://${serverUrl}/api/v1/metadata`;

    return fetch(endPoint)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json()
        })
        .then((data) => {
            return data.data

        })
};

export async function getTimeStampSeries(url: string) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return (await res.json()).data.result;
}

export async function fetchRecommendation(url: string) {
  console.log('fetch recommendation')
  console.log(url)
  return fetch(url)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json()
        })
        .then((data) => {
            return data
        })
}