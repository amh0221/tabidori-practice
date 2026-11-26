# 기본 모듈
from uuid import uuid4  # 겹치지 않는 일정번호를 만드는 함수 
# uuid4: 무작위 번호를 생성해서 남의 일정을 번호를 맞춰서 여는걸 방지

# 외부 패키지
from fastapi import APIRouter, HTTPException, status  # 창구 묶음 · 오류 응답 · 상태 코드 이름
# APIRouter: 창구 여러 개를 하나로 묶는 틀
# HTTPException: 404같은 오류 응답을 요청
# status: 201 대신 status.HTTP_201_CREATED처럼 이름으로 사용

# 타비도리 자체 패키지
from tabidori_contracts.plans import PlanResponse  # 일정 모양

# 라우터 생성
router = APIRouter(prefix="/api", tags=["plans"])  # plans 창구들을 묶는 중
# router:  창구들을 담는 그릇
# prefix="/api": 라우터 모든 주소 앞에 "/api"가 붙음
# tags=["plans"]: /docs 화면에서 창구들을 "plans"라는 묶음으로 모아 보여 줌

# 가짜 저장소 생성(메모리에만 존재)  -  5단계에서 DB로 변경 예정
_fake_plans: dict[str, PlanResponse] = {}  # 일정 번호(글자)  -> 일정(planResponse)을 짝지어 담는 사전, 처음엔 비어있음
# dict[str, PlanResponse]: 사전(dict), 번호를 넣으면 일정이 나옴
# 이름 앞의 _(밑줄): "이 파일 안에서만 사용하는 것"

# 빈 일정 만들기
@router.post("/plans", response_model=PlanResponse, status_code=status.HTTP_201_CREATED)
async def create_plan() -> PlanResponse:  # 함수 이름 = OperationId, 돌려주는 건 PlanResponse
    plan = PlanResponse(  # 새 빈 일정을 만듦
        id=str(uuid4()),  # 무작위 번호를 글자로 바꿔서 일정 번호를 씀 (*필수)
        status="input",  # 처음 단계는 입력 (*필수)
        travel_modes=["walk", "transit"],  # 기본 이동수단: 도보 · 전철 (*필수)
        tray=[],  # 트레이는 빈 목록으로 시작 (*필수)
        violations=[],  # 위반도 아직 없음 (*필수)
        can_undo=False,  # 되돌릴 것도 없음 (*필수)
        
        
    )
    _fake_plans[plan.id] = plan  # 가짜 저장소에 "번호 -> 일정"으로 넣어 둠
    return plan  # 만든 일정을 응답으로 돌려줌


