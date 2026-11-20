from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # docker compose는 환경변수로 넣어 주고, 컨테이너 밖에서 돌릴 때는 저장소 루트의 .env를 읽는다
    model_config = SettingsConfigDict(env_file=("../.env", ".env"), extra="ignore")

    database_url: str = ""
    cors_origins: str = "http://localhost:5173"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
