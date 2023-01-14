// 템플릿을 어떻게 사용할까?

// 무엇이 한글을 씹을까요 잘 모르겠습니다.
/**
 * 템플릿의 주요기능으로는
 *  - 모듈화 : 유일한 명칭, 가져오기, 내보내기, 캡슐화
 *  - 고정된 명칭 : ns(별칭이 추가되므로 짧게), group, page
 * 
 * [ hba 내부 ]
 * {{> header }}                                            :: 자신의 part 삽입하기
 * {{> group/view dir='app' }}                              :: 자신의 view 그룹파일 생성하기
 * {{> group/all dir='app' prefix='' suffix='' }}           :: 자신의 전체 page 생성하기
 * {{> page/first.c dir='...' }}                            :: 자신의 page를 독립파일 생성하기 (dir + 파일경로 사용)
 * {{> ns/view1/header }}                                   :: 네임스페이스의 part 삽입하기
 * {{> ns/view1/group/web dir='app'}}                       :: 네임스페이스의 그룹파일(web) 생성하기 (별도 생성) 
 * {{> ns/view1/page/first path='...' }}                    :: 네임스페이스의 페이지파일(first) 생성하기 (별도 생성)
 * {{> ns/view2/header }}
 * {{> ns/view2/group/web dir='app' }}
 * {{> ns/view2/group/web args='["A", "B"]' }}
 * {{> ns/view2/page/first.c dir='app' path='st.c' }}
 * 
 * 인자 정리
 *  - dir : page, group/*
 *  - path : page
 *  - args : group/!all(전체를 제외하고) 
 *  - prefix : page, group/*
 *  - suffix : page, group/*
 * 
 *  구분벌 정리 [중요!]
 *  - page :        prefix, suffix, dir, path
 *  - group/all :   prefix, suffix, dir         
 *  - group/* :     prefix, suffix, dir, args   
 * 
 * [ready() 내부]
 * this.group.add('spring', [ 
 *  {page: 'aaa.c', context: '{0}inc/fileA{1}'},   // A 그룹설정
 *  {page: 'bbb.c', context: '{0}inc/fileB{1}'},   // B 그룹설정
 *  ],
 *  ['A','B']);  // 접두접미사의 기본값
 * 
 * this.src.add('저장할경로', this.page['기존경로'])             :: 페이지 추가함
 * this.attachGroup('spring', '0', '1', '2'...)            :: {0}, {1}, {2}.. 인가지 주입됨 <group/spring>
 * this.attachGroup('all', 'prefix', 'suffix')             :: {0}, {1} 만 자동생성됨 <group/all>
 * 
 * // 순서 : alias, pre, suf, args
 * this.attachGroup('spring', '', '', ['0', '1', '2'...]) 
 * this.attachGroup('all', 'prefix', 'suffix')
 * 
 * REVIEW:  생성하겠다는 의미의 메소드명과 위치를 잘 정해야함
 * 
 * this.attachGroup('spring', ['0', '1', '2'...]) 
 * this.attachGroup('all', null, 'prefix', 'suffix')
 * this.attachGroup('all', [], 'prefix', 'suffix')
 * 
 * 정리
 *  - group 에서는 파일명을 새로 지정할 수 있고, 
 *  - page 에서는 접두사, 접미사, 시작경로만 조작가능하다.
 *  - 지정된 명칭 사용은 이름 충돌을 방지한다. (part 에서만 시작이름을 제한하면 된다.)
 *  - page, src 만이 컬렉션명칭에 확장자가 의미적으로 사용된다.
 *  - page, group 는 문장 중간에 삽입이 되는것이 아니고, 새로운 파일을 생성하는 것이다.
 * 
 * 이슈
 *  - 페이지를 직접가져와 사용하는 경우 path 사용자화 설정에 대한 부분이 없음
 *      => path 를 추가하여 해소함
 *  - 외부 ns 의 경우 inline 기능은 지원하지 않느다.
 *      + 필요시 해당객체를 쓰는 방식으로 우회할 수 있다.
 *      + 기능적으로 구현은 가능할수 있지만, 현재는 pass TODO:
 * 
 * 활용 요약
 *  - 직접 정의 후 사용
 *  - 상속하여 커스텀 후 사용
 *  - 외부에서 가져와 part,page 의 사용
 *  - 외부에서 여러개를 가져와 파일그룹 생성하여 사용
 * 
 * 활용사례
 *  - java sping의 경우 한페이지 추가가 여러개의 파일이 생성되어야 한다.
 *      + 템플릿 마스터 파일을 사용하고, 특정조건에 따라 추가적인 파일을 생성한다.
 *  - 외부에서 빠른 생산성을 요구될때
 *      + 템플릿을 공통의 구조를 빠르게 정의하고, 기존에 있는 템플릿은 가져와서 
 *          빠르게 코드의 구조를 완성한다.
 *  - 동일한 구조의 템플릿이 여러개 필요할경우
 *      + 템플릿 객체를 여러개 생성후, data를 수정하여 알맞게 파싱처리
 *      + 템플릿 객체가 다를때마다 객체를 생성하는 방법이 안정적인 방법이다.
 * 
 * 개발 시나리오
 *  - 모듈조회 및 오토 조립
 *      + DB 모듈의 조립 : 플랫폼, 기능 방식 선택
 *      + 사용할 모듈(auto) 의 선택
 *      + 개발환경 모듈은 상속을 통해서 재사용 : 신규로 만들지 상속할지 결정
 *  - 개발 및 사용자화
 *      + 엔티티(모델)의 정의 (우선 진행)
 *      + 필요 모듈의 상속하여 재정의
 *      + 필요한 모듈은 추가로 개발 (템플릿 활용)
 *  - 기본구성파일은 템플릿으로 생성한다.
 *      + *-svc.js 파일
 *      + DB 접근 class : .java, .cs, .php 등
 *      + 특수한경우파일 : spring, .net core EF 방식
 *      + DDL CRUDL : User[CRUDL].sql
 *  - 수작업 제작
 *      + 다지인 파일
 *      + 경로 라우팅 : 사용자, 관리자별
 *      + 템플릿으로 작성된 파일 수정 >> 테스트 >> 배치
 *  - 기타
 *      + 자주하는 공통작업은 template 로 정의한다.
 * 
 * 생산비용의 순위
 *  - [년] 설계 및 개발 모두 하는 경우
 *  - [분기] 설계는 되어 있고 개발만 하는 경우 
 *  - [월] 공통 모듈을 최대한 활용하는 경우
 *  - [주] 비슷한 프로젝트를 커스텀해서 사용한 경우 >> 오토의 위치
 *  - [분] 제품을 가지고 있는 경우
 * 
 * 보유하고 싶은 개발
 *  - 플러그인
 *      + 크롬 플러그인
 *      + vscode 확장
 *      + staruml 확장
 *  - DB 비즈니스 모듈들 (조립가능)
 * 
 *  - 컬렉션으로 추가된다.
 * 
 *      // 호환되어 삽입되어야함
 *      this.part = ns.part;
 *      this.part = ns.src;
 *      this.part = ns.page;
 *      this.src = ns[part | src | page];
 *      this.page = ns[part | src | page];
 * 
 *      // 지정 컬렉션만 등록가능
 *      this.helper = ns.helper;
 *      this.data = ns.data;
 * 
 *      this.group = ns.group;
 * 
 * 
 */