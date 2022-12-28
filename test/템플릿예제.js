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
 * {{> ns/view2/page/first.c dir='app' path='st.c' }}
 * 
 * [ready() 내부]
 * this.group.add('spring', [ 
 *  {page: 'aaa.c', page: '{0}inc/fileA{1}'},   // A 그룹설정
 *  {page: 'bbb.c', page: '{0}inc/fileB{1}'},   // B 그룹설정
 * ],
 * ['A','B']);  // 접두접미사의 기본값
 * this.src.add('저장할경로', this.page['기존경로'])             :: 페이지 추가함
 * this.src.addGroup('spring', '0', '1', '2'...)            :: {0}, {1}, {2}.. 인가지 주입됨 <group/spring>
 * this.src.addGroup('all', 'prefix', 'suffix')             :: {0}, {1} 만 자동생성됨 <group/all>
 * 
 * 정리
 *  - group 에서는 파일명을 새로 지정할 수 있고, 
 *  - page 에서는 접두사, 접미사, 시작경로만 조작가능하다.
 *  - 지정된 명칭 사용은 이름 충돌을 방지한다. (part 에서만 시작이름을 제한하면 된다.)
 *  - page, src 만이 컬렉션명칭에 확장자가 의미적으로 사용된다.
 * 
 * 이슈
 *  - 페이지를 직접가져와 사용하는 경우 path 사용자화 설정에 대한 부분이 없음
 *      => path 를 추가하여 해소함
 * 
 * 활용 요약
 *  - 직접 정의 후 사용
 *  - 상속하여 커스텀 후 사용
 *  - 외부에서 가져와 part,page 의 사용
 *  - 외부에서 여러개를 가져와 파일그룹 생성하여 사용
 * 
 * 활용사례
 *  - java sping의 경우 한페이지 추가가 여러개의 파일이 생성되어야 한다.
 *      + 템플릿 마스터 파일을 사용하고, 특정조건이 맞으면 추가적인 파일을 생성한다.
 *  - 외부에서 빠른 생산성을 요구될때 : 
 *      + 템플릿을 공통의 구조를 빠르게 정의하고, 기존에 있는 템플릿은 가져와서 
 *          빠르게 코드의 구조를 완성한다.
 */