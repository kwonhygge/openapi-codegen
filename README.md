# openapi-codegen


## 개요
![codegen](https://github.com/user-attachments/assets/37ee10e7-ca11-48fb-8634-132b7a9915bc)
OAS(OpenAPI Specification) 문서로부터 원하는 형태로 타입을 자동 생성하는 코드 생성기입니다. (ex zod schema)

[2024 FEConf에서 토스 프론트엔드 개발자(양의현)님의 발표](https://www.youtube.com/watch?v=B7hhxG1qUf8)에서 의현님이 설계하신 내용을 보고 영감을 받아 직접 작업해보았습니다.

구현과정에 대한 자세한 설명은 [이 블로그](https://catstanets.tistory.com/173)를 참고해주세요 :)

## 참고사항

- swagger 문서는 웹에 공개되어있는 https://petstore.swagger.io/v2/swagger.json를 활용(OpenAPI v2 기준)

## 설치
```shell
yarn install
```

## 실행 
```shell
yarn openapi-codegen
```
