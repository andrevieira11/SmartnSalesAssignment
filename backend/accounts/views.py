from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .cookies import clear_auth_cookies, set_auth_cookies
from .serializers import LoginSerializer, RegisterSerializer, UserSerializer

User = get_user_model()


def _issue_tokens(user):
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token), str(refresh)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=RegisterSerializer, responses={201: UserSerializer})
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        access, refresh = _issue_tokens(user)
        response = Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return set_auth_cookies(response, access, refresh)


class LoginView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=LoginSerializer, responses={200: UserSerializer})
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(**serializer.validated_data)
        if user is None:
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
        access, refresh = _issue_tokens(user)
        response = Response(UserSerializer(user).data)
        return set_auth_cookies(response, access, refresh)


class RefreshView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=None, responses={200: None})
    def post(self, request):
        raw = request.COOKIES.get(settings.AUTH_COOKIE_REFRESH)
        if not raw:
            return Response({"detail": "No refresh token."}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            refresh = RefreshToken(raw)
        except TokenError:
            return Response({"detail": "Invalid or expired refresh token."}, status=status.HTTP_401_UNAUTHORIZED)
        access = str(refresh.access_token)
        refresh_out = raw
        # Rotate: blacklist the used token and mint a fresh one (reuse -> 401).
        if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS"):
            user = User.objects.get(id=refresh["user_id"])
            try:
                refresh.blacklist()
            except AttributeError:
                pass
            refresh_out = str(RefreshToken.for_user(user))
        response = Response(status=status.HTTP_200_OK)
        return set_auth_cookies(response, access, refresh_out)


class LogoutView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=None, responses={205: None})
    def post(self, request):
        raw = request.COOKIES.get(settings.AUTH_COOKIE_REFRESH)
        if raw:
            try:
                RefreshToken(raw).blacklist()
            except (TokenError, AttributeError):
                pass
        response = Response(status=status.HTTP_205_RESET_CONTENT)
        return clear_auth_cookies(response)


class MeView(APIView):
    @extend_schema(responses={200: UserSerializer})
    def get(self, request):
        return Response(UserSerializer(request.user).data)


class UserListView(ListAPIView):
    """Directory of users for assignee pickers (id + username)."""

    serializer_class = UserSerializer
    pagination_class = None

    def get_queryset(self):
        return User.objects.order_by("username")
