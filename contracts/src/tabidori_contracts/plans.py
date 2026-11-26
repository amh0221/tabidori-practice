# 파이썬 기본 모듈
from typing import Literal  # Literal: 이 칸에는 정해진 값 몇개만 올 수 있음

# 외부 패키지
from pydantic import BaseModel  # BaseModel: Pydantic의 기본 틀

# https://app.apidog.com/project/1417705에서
# 데이터 모델 목록 중 TrayItem, Violation, PlanResponse 구현


# TrayItem 클래스 정의
class TrayItem(BaseModel):  # BaseModel을 상속한 TrayItem모양을 생성
    place_id: str  # 장소 ID는 글자 (*필수)
    name: str  # 화면에 보여 줄 이름은 글자 (*필수)
    position: int  # 순서는 숫자 (*필수)
    stay_minutes: int | None = None  # 체류시간은 숫자, 없을 수 있음
    badge: str | None = None  # 휴무 배지는 글자, 없을 수 있음
    mode_to_next: str | None = None  # 다음까지 이동수단은 글자, 없을 수 있음


# Violation 클래스 정의
class Violation(BaseModel):  # 위반 하나의 모양
    type: str  # 위반 종류는 글자 (*필수)
    place_id: str | None = None  # 어느 스팟인지, 일정 전체 위반이면 없음
    message: str  # 화면에 보여 줄 설명은 글자 (*필수)


# PlanResponse 클래스 정의
class PlanResponse(BaseModel):  # 일정 하나의 모양 (거의 모든 창구가 돌려줌)
    id: str  # 일정 번호는 글자 (*필수)
    date: str | None = None  # 여행 날짜, 정하기 전이면 없음
    status: Literal["input", "verifying", "result", "confirmed"]  # 이 4개 중 하나만 (*필수)
    start_time: str = "09:00"  # 시작 시각 (기본값 09:00, 응답에는 항상 있음)
    end_time: str | None = None  # 마감 시각, 정했을 때만
    travel_modes: list[str]  # 이동수단 목록, 안에는 글자 (*필수)
    tray: list[TrayItem]  # 트레이 목록, 안에는 위에서 만든 TrayItem (*필수)
    violations: list[Violation]  # 위반 목록, 안에는 위에서 만든 Violation (*필수)
    can_undo: bool  # 되돌리기 가능 여부는 참/거짓 (*필수)
    notice: str | None = None  # 안내 문구, 있을 때만
    tip: str | None = None  # 여행 팁, 검증 후에만
    bubble: str | None = None  # 말풍선 문구, 있을 때만
