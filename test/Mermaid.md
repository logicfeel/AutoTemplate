# 순서도
## 모양
```mermaid
graph TD;
%% 방향
%% TB(top to bottom), TD(top to down)
%% BT(bottom to top)
%% RL(right to left) LR(left to right)
subgraph 모양
    A(둥근 모서리) -->
    B([둥근 측면]) -->
    C[[서브루틴 형태]] -->
    D[(원통형)]
    E((원)) -->
    F>깃발] -->
    G{마름모:분기} -->
    H{{육각형}} -->
    I[/마름모/] 
    J[\마름모2\] -->
    K[/사다리꼴\] -->
    L[\깔대기/] -->
    M(((서클)))
end
```

## 관계
```mermaid
graph TD;
subgraph 관계
    a-->|실선 화살 1|b
    a--실선 화살 2-->b
    c---|실선 1|d
    c--실선 2---d
    g-.->|점선 1|h
    g-.점선 2.->h
    i==>|굴은 화살 1|j
end
```

## 관계 연결
```mermaid
graph TD;
subgraph 선형
    a-->b-->c
end
subgraph 복합 1
    aa-->bb & cc-->dd
end
subgraph 복합 2
    aaa & bbb --> ccc & ddd
end
```

## 다방향 화살표  및 새로운 유형
```mermaid
graph TD;
A1 --o A2 o--o A3
B1 --x B2 x--x B3
C1 --> C2 <--> C3
```

## 선 길이
| 길이에 따라 노선이 정해짐
```mermaid
graph TD;
%% 길이에 따라 노선이 정해짐
subgraph 실선 화살
    a --> |길이 1|b
    c ---- |길이 2|d
    e -----> |길이 3|f
end
subgraph 실선
    a1 ==> |길이 1|b1
    c1 ==== |길이 2|d1
    e1 ===== |길이 3|f1
end
subgraph 점선
    a2 -.-> |길이 1|b2
    c2 -..- |길이 2|d2
    e2 -...-> |길이 3|f2
end
```

## 그룹 및 방향
```mermaid
graph LR
  subgraph TOP
    direction TB
    subgraph B1
        direction RL
        i1 -->f1
    end
    subgraph B2
        direction BT
        i2 -->f2
    end
  end
  %% 그룹 및 요소간 관계
  A --> TOP --> B
  B1 --> B2
```

## 긴 문장 & 화살표 대체 & 스타일
```mermaid
graph TD;
    A("누르면 링크") --o b
    c --x d
    e x--x f
    %% 링크 설정
    click A "https://www.github.com" _blank
    %% 클래스로 지정
    A:::someclass --> B
    classDef someclass fill:#f96
    %% id 별 지정
    id1(Start)-->id2(Stop)
    style id1 fill:#f9f,stroke:#333,stroke-width:4px
    style id2 fill:#bbf,stroke:#f66,stroke-width:2px,color:#fff,stroke-dasharray: 5 5

```
| 선언후에 사용할 수 있다.

# 시퀀스 관계 다이어그램
```mermaid
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!
```

# 클래스 다이어그램
```mermaid
classDiagram
    note "From Duck till Zebra"
    Animal <|-- Duck
    note for Duck "can fly\ncan swim\ncan dive\ncan help in debugging"
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }
```
# 상태 다이어그램
```mermaid
stateDiagram-v2
    [*] --> Still
    Still --> [*]

    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
```


# 엔티티 관계 다이어그램
```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
```


# 간트
```mermaid
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d
```

# 파이 차트
```mermaid
pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
```

# 커밋 흐름도
```mermaid
gitGraph:
    commit "Ashish"
    branch newbranch
    checkout newbranch
    commit id:"1111"
    commit tag:"test"
    checkout main
    commit type: HIGHLIGHT
    commit
    merge newbranch
    commit
    branch b2
    commit
```