# tracking-api

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/dotplants/tracking-api/Node%20CI?style=for-the-badge)](https://github.com/dotplants/tracking-api/actions)
[![code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge&logo=prettier)](https://prettier.io/)

> Unofficial delivery tracking API in Japan

https://jp-tracking-api.now.sh/

## 対応している運送会社

- 日本郵便
- ヤマト

## API

### 荷物を追跡

```
https://jp-tracking-api.now.sh/api/tracking?code=xxxxxxxxxx
```

- code<`string`>: 追跡番号
- type<`'jp-post' | 'yamato'`>: 運送会社 (Optional)

```json
{
  "id": "xxxxxxxxx",
  "type": "yamato",
  "currentStatus": {
    "type": "completed",
    "label": "配達完了: このお品物はお届けが済んでおります。"
  },
  "history": [
    {
      "date": "04/01 00:00",
      "status": {
        "type": "picked",
        "label": "荷物受付"
      },
      "description": "",
      "place": "xxxxxxxx (コード: xxxxxx)"
    },
    {
      "date": "04/01 00:00",
      "status": {
        "type": "delivering",
        "label": "発送"
      },
      "description": "",
      "place": "xxxxxxxx (コード: xxxxxx)"
    },
    {
      "date": "04/01 00:00",
      "status": {
        "type": "delivering",
        "label": "作業店通過"
      },
      "description": "",
      "place": "xxxxxxxx (コード: xxxxxx)"
    },
    {
      "date": "04/01 00:00",
      "status": {
        "type": "completed",
        "label": "配達完了"
      },
      "description": "",
      "place": "xxxxxxxx (コード: xxxxxx)"
    }
  ]
}
```

- `currentStatus.type`, `status.type`: `'unknown' | 'issue' | 'picked' | 'delivering' | 'absence' | 'completed'`
- 何らかのエラーが発生した場合はオブジェクト内に `error` が入ります

## デプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fdotplants%2Ftracking-api&env=CONTACT_INFO&envDescription=user-agent%E3%81%AB%E8%A8%98%E8%BC%89%E3%81%99%E3%82%8B%E9%80%A3%E7%B5%A1%E5%85%88%E3%82%92%E5%85%A5%E5%8A%9B)

- user-agent に記載する連絡先を登録するため、`CONTACT_INFO` env が必要です。

## Contributing

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

- 新たな配送業者の追加
- 解析ドキュメントの修正: https://github.com/dotplants/tracking-api/blob/main/docs/development/index.md
