# `sexyits2` 컬렉션 사용 가이드

이 문서는 [b-cube-sexyit-crawl](../README.md) 크롤러가 채우는 MongoDB `sexyits2` 컬렉션을 다른 프로젝트(웹사이트, 관리자 페이지 등)에서 읽어 쓰려는 개발자를 위한 안내입니다.

## 요약

- **위치:** MongoDB `bcube` DB의 `sexyits2` 컬렉션
- **내용:** Instagram [@sexyit_season2](https://www.instagram.com/sexyit_season2/) 게시물. 게시물 1개당 문서 1개입니다.
- **갱신:** 크롤러가 매일 08:00(KST) 전후로 추가하고 삭제합니다.
- **사용 방법:** 조회와 **삭제만** 허용합니다. 추가와 수정은 크롤러만 합니다. 자세한 내용은 [관리자 페이지에서 허용하는 작업](#관리자-페이지에서-허용하는-작업)을 보세요.
- **정렬:** 목록은 항상 `date` 내림차순(최신순)으로 보여주세요.
- **이미지:** 모든 문서의 `imagePath`는 바로 `<img src>`에 넣을 수 있는 공개 URL입니다.

## 연결 정보

| 항목 | 값 |
|---|---|
| DB | `bcube` |
| 컬렉션 | `sexyits2` |
| 연결 문자열 | 크롤러와 같은 MongoDB Atlas 클러스터입니다. 값은 관리자에게 받으세요. 공개 페이지에는 읽기 권한만 있는 계정을, 관리자 페이지에는 삭제가 가능한 계정을 따로 만들어 쓰세요. |

## 문서 스키마

```json
{
  "_id": ObjectId("6ae5ba57381d6433fbfe49c2"),
  "ig_post_id": "DeRscWJlMqA",
  "date": ISODate("2026-10-09T14:11:57Z"),
  "title": "온디바이스AI",
  "imagePath": "https://pub-11820c5f91164abc8e3e6e6bb3459741.r2.dev/sexyit2/DeRscWJlMqA.jpg",
  "url": "https://www.instagram.com/p/DeRscWJlMqA/"
}
```

| 필드 | 타입 | 설명 |
|---|---|---|
| `_id` | ObjectId | MongoDB 기본 키 |
| `ig_post_id` | string | Instagram 게시물 shortcode. **고유값**이며 게시물을 식별할 때는 이 값을 쓰세요. |
| `date` | Date (UTC) | Instagram에 게시된 시각. 화면에 보여줄 때는 KST(UTC+9)로 변환하세요. |
| `title` | string | 본문에서 처음 나오는 해시태그(`#` 제외). 항상 비어 있지 않습니다. |
| `imagePath` | string | R2에 저장된 대표 이미지의 공개 URL |
| `url` | string | Instagram 게시물 링크 |

모든 필드는 항상 존재합니다. 다른 필드는 없습니다.

### 필드별 참고 사항

- **`title`**
  - 해시태그 문자열 그대로입니다. 예: `휴머노이드_로봇`.
  - 밑줄(`_`)이 포함될 수 있으니, 띄어쓰기로 보여주려면 화면에서 `_`를 공백으로 바꾸세요.
  - 본문에 해시태그가 없는 게시물은 크롤러가 저장하지 않습니다. 그래서 Instagram 게시물 수보다 문서 수가 적습니다.
- **`imagePath`**
  - Instagram 원본 중 가장 큰 해상도의 이미지입니다.
  - 사진 여러 장짜리 게시물은 첫 장, 동영상은 커버 이미지입니다.
  - 확장자는 대부분 `.jpg`지만 `.png`, `.webp`, `.heic`일 수도 있습니다.
- **`date`**: 정렬 기준으로 쓰세요(내림차순). `_id` 순서는 저장된 순서이지 게시된 순서가 아닙니다. 삭제했다가 다시 저장된 게시물은 `_id`상 맨 뒤로 갑니다.

## 데이터가 바뀌는 방식

크롤러는 하루에 한 번 Instagram 계정 전체를 확인합니다.

| Instagram에서 | `sexyits2`에서 |
|---|---|
| 새 게시물이 올라옴 | 다음 실행에서 문서 추가 |
| 해시태그 없이 올라옴 | 저장 안 함. 나중에 해시태그를 넣으면 다음 실행에서 추가됩니다. |
| 게시물이 삭제됨 | 다음 실행에서 문서 삭제. R2 이미지는 남아 있어 URL은 계속 열립니다. |
| 본문이나 사진이 수정됨 | **자동으로 반영되지 않음.** 반영하려면 관리자 페이지에서 해당 문서를 삭제하세요. 다음 실행에서 수정된 내용으로 다시 저장됩니다. |

그 밖의 동작:

- 하루 중에는 데이터가 바뀌지 않습니다. 캐시를 쓴다면 하루 단위로 갱신해도 충분합니다.
- 크롤링이 실패한 날에는 아무것도 바뀌지 않습니다. 그날은 전날 데이터가 그대로 남습니다.

## 관리자 페이지에서 허용하는 작업

| 작업 | 허용 | 이유 |
|---|---|---|
| 조회 | ✓ | |
| 삭제 | ✓ | Instagram에서 수정된 게시물을 다시 받아오는 용도 |
| 수정 | ✗ | 크롤러는 이미 저장된 문서를 갱신하지 않으므로 Instagram과 내용이 어긋남 |
| 추가 | ✗ | 크롤러가 Instagram 게시물만 관리함 |

### 삭제하면 일어나는 일

1. 관리자가 `ig_post_id`로 문서를 삭제합니다.
2. 다음 크롤러 실행에서 이 게시물이 Instagram에 남아 있으면 새 게시물로 판단해 다시 저장합니다.
   - Instagram의 현재 본문, 해시태그, 이미지로 저장됩니다.
   - 이미지는 같은 R2 경로에 덮어씁니다. 확장자가 바뀐 경우에만 새 경로로 저장됩니다.
   - 문서의 `_id`는 새 값이 됩니다.
3. 다시 저장될 때까지는 목록에서 빠져 있습니다. 바로 반영하려면 크롤러 저장소의 **Actions → Crawl Instagram → Run workflow**로 수동 실행하세요.

참고 사항:

- **게시물을 숨기는 기능이 아닙니다.** 삭제해도 다음 날 다시 나타납니다. 특정 게시물을 노출하지 않으려면 사용하는 쪽에서 `ig_post_id`로 걸러내세요.
- **해시태그를 지웠다면:** Instagram에서 해시태그를 지운 게시물을 삭제하면 다시 저장되지 않습니다. 크롤러가 해시태그 없는 게시물은 건너뛰기 때문입니다.

```js
// 관리자 페이지의 삭제
db.sexyits2.deleteOne({ ig_post_id: "DeRscWJlMqA" })
```

## 쿼리 예시

목록은 항상 `date` 내림차순(최신순)으로 정렬하세요.

### 최신순 목록과 페이지네이션

```js
db.sexyits2.find({}, { _id: 0 }).sort({ date: -1 }).skip(0).limit(12)
```

### 특정 게시물

```js
db.sexyits2.findOne({ ig_post_id: "DeRscWJlMqA" })
```

### Mongoose (Node.js)

기존 `sexyits` 컬렉션을 Mongoose로 쓰고 있다면 아래처럼 모델을 하나 추가하면 됩니다. 세 번째 인자로 컬렉션 이름을 꼭 지정하세요. 지정하지 않으면 Mongoose가 모델 이름을 복수형으로 바꾼 다른 컬렉션을 찾습니다.

```js
const sexyit2Schema = new mongoose.Schema(
  {
    ig_post_id: { type: String, required: true },
    date: { type: Date, required: true },
    title: { type: String, required: true },
    imagePath: { type: String, required: true },
    url: { type: String, required: true },
  },
  { versionKey: false, autoIndex: false },
);

const Sexyit2 = mongoose.model('Sexyit2', sexyit2Schema, 'sexyits2');

const posts = await Sexyit2.find().sort({ date: -1 }).limit(12).lean();
```

`autoIndex: false`는 다른 프로젝트가 이 컬렉션에 인덱스를 만들지 않게 하려는 설정입니다.

### pymongo (Python)

```python
posts = client["bcube"]["sexyits2"].find({}, {"_id": 0}).sort("date", -1).limit(12)
```

## 기존 `sexyits` 컬렉션에서 옮겨올 때

| | `sexyits` (기존) | `sexyits2` (신규) |
|---|---|---|
| 채우는 방식 | 관리자가 직접 입력 | 크롤러가 자동으로 동기화 |
| 필드 | `date`, `title`, `imagePath`, `url`, `__v` | `date`, `title`, `imagePath`, `url`, `ig_post_id` |
| `url` | 계정 프로필 주소 | 게시물 주소 |
| 이미지 경로 | 예: `.../sexyit/<timestamp>-sexyit-.png` | `.../sexyit2/<shortcode>.<ext>` |

- 공통 필드(`date`, `title`, `imagePath`, `url`)의 이름과 타입은 같습니다. 화면 코드는 컬렉션 이름만 바꿔도 대부분 그대로 동작합니다.
- 기존 데이터는 `sexyits2`로 옮기지 않았습니다. 두 컬렉션을 함께 보여줘야 한다면 사용하는 쪽에서 합쳐야 합니다.

## 하지 말아야 할 것

- **문서를 추가하거나 수정하지 마세요.** 허용되는 쓰기는 삭제뿐입니다.
  - 직접 추가한 문서의 `ig_post_id`가 Instagram에 없는 값이면, 크롤러가 삭제된 게시물로 판단해 지웁니다.
  - 직접 수정한 내용은 크롤러가 덮어쓰지 않아 Instagram과 계속 어긋납니다. 내용을 바로잡으려면 Instagram에서 수정한 뒤 문서를 삭제하세요.
- **인덱스를 추가하거나 지우지 마세요.**
  - 지금 인덱스는 `_id`와 `ig_post_id`(unique) 두 개입니다.
  - `ig_post_id` 인덱스는 크롤러가 중복 저장을 막는 데 씁니다.
  - 문서가 수백 개 수준이라 `date` 정렬에 인덱스는 필요 없습니다.
- **R2 이미지 URL을 다른 곳에 복사해 두지 마세요.** 항상 `imagePath`를 그대로 쓰세요. 삭제 후 다시 저장되면서 확장자가 바뀌면 경로도 바뀝니다.

## 문의 및 장애 대응

- **새 게시물이 하루 넘게 반영되지 않을 때**
  - 크롤러 저장소의 **Actions → Crawl Instagram** 실행 기록을 확인하세요.
  - Instagram이 요청을 막으면 실행이 실패하는데, 이때 데이터는 바뀌지 않고 그대로 남습니다.
  - 동작 방식과 알려진 제약은 [README](../README.md)에 정리되어 있습니다.
- **스키마 변경이 필요할 때:** 크롤러 저장소에 이슈를 남겨 주세요. 필드를 추가하거나 바꾸면 이 문서도 함께 갱신합니다.
