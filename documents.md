https://community.blackboard.com/docs/DOC-4210-blackboard-rest-api
https://developer.blackboard.com/portal/displayApi
https://help.blackboard.com/ko-kr/Learn/Administrator/SaaS/Integrations/Compare_Building_Blocks_and_Rest
https://community.blackboard.com/docs/DOC-1644-authorization-and-authentication

Whiteboard 0.0.1
New API Key
Important note!

The secret and tool private key are only shown once. Make note of the application key, secret and tool private key and store them in a safe and secure location.

Application key
70605bef-e09c-4ddb-b093-6bea9a8d0ee1
Copy
Secret
gjzUfwgz56VLKFKkzpJfpxYksuN9Dteb
Copy
Issuer
https://blackboard.com
Copy
Public keyset URL
https://developer.blackboard.com/api/v1/management/applications/9bf87f82-6c56-4a7c-877d-e16c5f8e13f8/jwks.json
Copy
Auth token endpoint
https://developer.blackboard.com/api/v1/gateway/oauth2/jwttoken
Copy
Tool private key
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCCEmMTB1N731ta
9X+RMpaeazx3AaKxbBc7BueuunNBgWzPqYrV1aGyrJ/e6BgZYbgtuVEM5MuxvHaH
/3qZAkkX6RZc4xjkcUsIn88CHKGX3sMSbWip6HmJU9wAhkFE5mHPbm2Tmr4jvadx
3hdThR74b2sNoMm4ox4mN4ydY0pswmVWQtUD7mnzSUDBdIzYzDd3RsORl3qotzkI
DW6Tu/qMgDzb0+5TRilH/VdMisy7c6gzsfF4msrvu8NiDmbnw/bADMAji0KNs+yC
dIxS7+xXTL+TQ6mtcwhI3hR/hP0M7FhFonZY+MOkdF/8kGiYDsXoqdNdKWm1/IpI
DRIhiCRJAgMBAAECggEAXgJ6Fvu5jBNADPrY65GbqP4qonzNINzV4XS5KOFbgiHQ
CjsovCp+hwwbNFmdaWLmYi3Jdb87tcdYCC1PZ51uRNjTr+j3SczUhXQzgvw8ku6P
IRdwiTUb+nRg0wQ10l2MngbbLc6u1Fgz2KnDRDs3yimFP0FR6qACn26QtARae0Xp
f0tSun3K5oy5/F1r3NX0a8I6xuaUXkTRsIq3VrKUR5+MaPTWH0483A03HAEYHNZc
1wTrSRpODyXB4ej4dVdLBVAPHHSDkLECnqUAr9YmHR3UvMbz9cPAsb++f9iszhHU
jEPD+ZdITh8wj7xMt0I8wMJt2u3j4O+6t8rMhYUNcQKBgQDpSvWmMnyeJIdfygyo
UHF4wKSr0P1rPe7Nz71NthejlYkaj6o3Suot+5XglWnsvYdRXpecxl4I3gK8gMJQ
yNLof416u3RKyw8vDVf+T1Ul0RzRL6sQ7Zt+KEPYheayYatJcuOeiqqQ/aUiPaBQ
aaSk2oZkl9g5vY3y3CObat9nPQKBgQCOu27ljeZ8ICyiES8AqYdoQelqG2cVIA1o
qsOgHtPNlt3yxabaUY1MOxqF250jFcVqva47TibR5Zm9TFNPdOc6Z4Bz0vDZWPVv
P9A34blYHg/4Gm4g8m49N5M5IQngrjvqL1SBjUU7b/M6Dg6A9Rfzt0vULOte/G2Z
UjXUQTVh/QKBgDmYnBUwGbwhYJqxk3Zqhdk+Fmmk6yvy2mZNh3sMHcHxRSwdk/Sa
tj4sAtCzkrc0A5h/NgcqokSmKx7G2zJ+ojNsak2GwitE/rarILJUe70eZ3Ltxdok
D2OSJU3roQ0hN9ymVLProDizpnVRqaawrklU+iETq/p1Zfozh0bzl7wxAoGAPEDf
tcRLckba0KfUYcEvSlHYyVQ8Fezr/C1qW+Pnobh4hY3uu+cFcRLaRXvKQA9mwYLF
VH/PX3g/iGv6F2bQXhVnYn2/8uDc61PTAGQnrA00zJXLu9jbtLgLTGioFNM4s8m7
MN2ERm0iDnX0pXfR3q6YMj+sNPL3CWxtEOdeM7kCgYEA5nuFruW3T3DsHuqY/b5W
BTexaSZVSX7EBfM2i0cFI+b0rsXGMylRNowrDy89/IBMzOR2WHk3y0BKoyc4e3Db
joRTE6Hc60axJUGYLHLIVVYmw3m1CKQwLoTK06Gdzv5rdnLCgkdwEv/EH9hRwWzO
ei5MLDsw4zhJ63uc264kqxU=
-----END PRIVATE KEY-----

Oauth token
http://hublog.hubmed.org/archives/002010.html

curl -k -i -X POST -u "$key:$secret" $server/learn/api/public/v1/oauth2/token -d "grant_type=client_credentials"

?
2cdc9fbd-46e4-4f9d-b157-2c6ceb6c4fbb