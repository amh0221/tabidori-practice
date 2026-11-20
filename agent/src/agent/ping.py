"""연결 확인용 그래프. Claude를 부르지 않아 키 없이도 돈다.

실제 그래프(채팅·Loop A)가 들어오면 지운다.
"""

from typing import TypedDict

from langgraph.graph import END, START, StateGraph


class PingState(TypedDict):
    text: str


def echo(state: PingState) -> dict:
    return {"text": f"pong: {state['text']}"}


builder = StateGraph(PingState)
builder.add_node("echo", echo)
builder.add_edge(START, "echo")
builder.add_edge("echo", END)
graph = builder.compile()
