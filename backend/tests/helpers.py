def register(client, username, password="Str0ngP@ss1"):
    return client.post(
        "/api/auth/register/",
        {"username": username, "email": f"{username}@t.test", "password": password},
        format="json",
    )


def csrf_header(client):
    # Echo the readable CSRF cookie back as the double-submit header.
    return {"HTTP_X_CSRF_TOKEN": client.cookies["csrf_token"].value}
