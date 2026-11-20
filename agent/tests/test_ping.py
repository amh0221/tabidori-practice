from agent.ping import graph


def test_ping_그래프는_입력을_되돌려준다():
    assert graph.invoke({"text": "타비도리"}) == {"text": "pong: 타비도리"}
