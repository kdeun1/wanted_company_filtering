원티드 채용공고의 여러 회사를 원했고 지원했지만 아쉽게도 다른 회사를 검색하는 경우 사용하는 크롬 익스텐션 도구입니다.

## 사용방법

0. 해당 프로젝트를 클론 받거나 다운로드합니다.

   ```
   git clone https://github.com/kdeun1/wanted_company_filtering.git
   ```

1. Chrome Extension > 개발자 모드 > '압축해제된 확장 프로그램을 로드합니다.' 버튼 클릭.

   ![alt text](/assets/add_chrome_extensions.png)

   로드 경로를 다운받은 프로젝트의 폴더로 지정합니다.

   다음과 같이 리스트가 나타납니다.

2. 원티드 > 채용공고 메뉴 들어가서 해당 익스텐션 사용하여 회사명 필터링걸기.

   ![alt text](/assets/wanted_before.png)

   크롬 익스텐션 열고 검색어 입력하기 (콤마 및 개행문자로 구분)

   ![alt text](/assets/wanted_after.png)

   제외 단어 입력 후 필터링 하기

3. 사용법

   제외 단어 textarea에 회사명, 직무에 제외할 단어들을 입력합니다.

   이 때, 콤마와 개행문자를 기준으로 구분할 수 있습니다.

   체크박스를 체크하면 필터링이 시작하고 textarea 값이 로컬스토리지에 저장됩니다.

   체크박스를 체크해제하면 필터링이 종료되어 원래 상태로 돌아옵니다.

   체크박스의 체크 값은 스토리지에 저장됩니다.

   딜레이 시간은 약 500ms입니다.

   (미완) 스토리지 클리어 버튼을 클릭하면 스토리지 내 값을 제거합니다.

4. 추후 계획

   스토리지 클리어 기능 개발 계획

   원티드 외에 다른 채용 사이트에 적용할 예정

   채용 사이트별 체크박스로 구분

   적절한 아이콘 추가 예정 (필터 온오프에 따라 색상 부여 예정)

5. 파악된 버그 및 개선사항

   필터링 체크박스가 체크되어 있는 경우 채용 페이지 첫 진입 시 필터링 안되는 버그 수정 필요.

   API 값을 가져온 이후 DOM에 직접적인 스타일 수정을 위해 500ms 딜레이 시간을 두었음. 타이밍을 빠르게 변경하거나 전체적인 로직 수정 필요.
