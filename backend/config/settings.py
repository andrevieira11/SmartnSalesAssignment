"""Django settings for the SmartnSales Task Board API (env-driven, container-first)."""
import os
from datetime import timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def env_bool(key, default="false"):
    return os.environ.get(key, default).lower() in ("1", "true", "yes", "on")


SECRET_KEY = os.environ.get("SECRET_KEY", "dev-insecure-change-me")
DEBUG = env_bool("DJANGO_DEBUG", "true")
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "*").split(",")
CSRF_TRUSTED_ORIGINS = [o for o in os.environ.get("CSRF_TRUSTED_ORIGINS", "").split(",") if o]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "drf_spectacular",
    "django_filters",
    "accounts",
    "projects",
    "tasks",
]

# CsrfViewMiddleware stays for the Django admin; DRF cookie-JWT routes use our
# stateless double-submit guard (CsrfDoubleSubmitMiddleware) on /api/.
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "accounts.middleware.CsrfDoubleSubmitMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("POSTGRES_DB", "smartnsales"),
        "USER": os.environ.get("POSTGRES_USER", "smartnsales"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD", "smartnsales"),
        "HOST": os.environ.get("POSTGRES_HOST", "db"),
        "PORT": os.environ.get("POSTGRES_PORT", "5432"),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ["accounts.authentication.CookieJWTAuthentication"],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=int(os.environ.get("JWT_ACCESS_MINUTES", "15"))),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=int(os.environ.get("JWT_REFRESH_DAYS", "7"))),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}

# Auth cookie config — JWTs are HttpOnly (never readable by JS); the CSRF
# double-submit token is intentionally readable so the client can echo it.
AUTH_COOKIE_ACCESS = "access_token"
AUTH_COOKIE_REFRESH = "refresh_token"
CSRF_DS_COOKIE = "csrf_token"
CSRF_DS_HEADER = "X-CSRF-Token"
AUTH_COOKIE_SECURE = env_bool("AUTH_COOKIE_SECURE", "false")
AUTH_COOKIE_SAMESITE = os.environ.get("AUTH_COOKIE_SAMESITE", "Lax")
AUTH_COOKIE_DOMAIN = os.environ.get("AUTH_COOKIE_DOMAIN") or None

SPECTACULAR_SETTINGS = {
    "TITLE": "SmartnSales Task Board API",
    "DESCRIPTION": "Projects & Tasks API with cookie-based JWT auth.",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}
