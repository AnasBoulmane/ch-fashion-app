

curl 'https://www.chanel.com/api/us/suggest?locale=en_US&language=en_US&q=chane' \
  -H 'accept: */*' \
  -H 'accept-language: en,fr;q=0.9,fr-FR;q=0.8,en-US;q=0.7,ar;q=0.6,ja;q=0.5,zh-CN;q=0.4,zh;q=0.3' \
  -H 'content-type: application/json' \
  -H 'priority: u=1, i' \
  -H 'referer: https://www.chanel.com/us/fashion/shoes/c/1x1x5/' \
  -H 'sec-ch-ua: "Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' \
{ 
  "data": {
    "suggestions": [
      {
        "axistype_id": "makeup",
        "nrResults": 11,
        "display_searchterm": "coco chanel",
        "axisName": "makeup"
      },
      {
        "axistype_id": "jewelry",
        "nrResults": 112,
        "display_searchterm": "coco chanel",
        "axisName": "fine jewelry"
      },
      {
        "axistype_id": "fragrance",
        "nrResults": 38,
        "display_searchterm": "coco chanel",
        "axisName": "fragrance"
      },
      {
        "axistype_id": "watches",
        "nrResults": 22,
        "display_searchterm": "boy chanel",
        "axisName": "watches"
      },
      {
        "axistype_id": "skincare",
        "nrResults": 3,
        "display_searchterm": "boy chanel",
        "axisName": "skincare"
      },
      {
        "axistype_id": "eyewear",
        "nrResults": 344,
        "display_searchterm": "chanel sunglasses",
        "axisName": "eyewear"
      },
      {
        "axistype_id": "fashion",
        "nrResults": 119,
        "display_searchterm": "bleu de chanel",
        "axisName": "fashion"
      }
    ]
  },
  "success": true,
  "timestamp": "2024-12-29T19:08:02.989Z"
}